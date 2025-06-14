"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap, Polygon } from "react-leaflet";
import L, { Map } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Loader2 } from "lucide-react";
import { BOLIVIA_DEPARTMENTS, BOLIVIA_BOUNDS } from "../../utils/BoliviaGeo";

// Configuración de íconos
const carIcon = new L.Icon({
  iconUrl: 'https://img.icons8.com/?size=100&id=QNXMW3NgF3oq&format=png&color=000000',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

// Función para verificar si un punto está dentro de Bolivia
const isWithinBolivia = (lat: number, lng: number): boolean => {
  const [sw, ne] = [BOLIVIA_BOUNDS.southWest, BOLIVIA_BOUNDS.northEast];
  return lat >= sw[0] && lat <= ne[0] && lng >= sw[1] && lng <= ne[1];
};

interface LocationMarkerProps {
  position: [number, number] | null;
  setPosition: (pos: [number, number] | null) => void;
  setError: (msg: string) => void;
  departamento: string;
  provincia: string;
  selectedDepartmentName: string;
}

function isPointInPolygon(point: [number, number], polygon: [number, number][]) {
  const [x, y] = point;
  let inside = false;
  
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    
    const intersect = ((yi > y) !== (yj > y)) &&
      (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  
  return inside;
}

function LocationMarker({ 
  position, 
  setPosition, 
  setError, 
  departamento, 
  provincia,
  selectedDepartmentName 
}: LocationMarkerProps) {
  const map = useMap();
  const markerRef = useRef<L.Marker>(null);
  const [currentProvincePolygon, setCurrentProvincePolygon] = useState<[number, number][] | null>(null);
  const [currentDepartmentPolygon, setCurrentDepartmentPolygon] = useState<[number, number][] | null>(null);

  useEffect(() => {
    if (departamento && selectedDepartmentName) {
      const departmentData = BOLIVIA_DEPARTMENTS.find(p => 
        p.name.toLowerCase() === selectedDepartmentName.toLowerCase()
      );
      setCurrentDepartmentPolygon(departmentData?.coordinates || null);
    } else {
      setCurrentDepartmentPolygon(null);
    }
  }, [departamento, selectedDepartmentName]);

  useEffect(() => {
    if (provincia) {
      const provinceData = BOLIVIA_DEPARTMENTS.find(p => 
        p.name.toLowerCase() === provincia.toLowerCase()
      );
      setCurrentProvincePolygon(provinceData?.coordinates || null);
    } else {
      setCurrentProvincePolygon(null);
    }
  }, [provincia]);

  const checkLocationInRegion = (latlng: L.LatLng): { valid: boolean; message: string } => {
    // Primero verificar si está dentro de Bolivia
    if (!isWithinBolivia(latlng.lat, latlng.lng)) {
      return { 
        valid: false, 
        message: "La ubicación seleccionada está fuera de Bolivia" 
      };
    }
    
    if (!departamento || !selectedDepartmentName) {
      return { valid: true, message: "" };
    }
    
    // Verificar contra el departamento
    if (currentDepartmentPolygon && !isPointInPolygon([latlng.lat, latlng.lng], currentDepartmentPolygon)) {
      return { 
        valid: false, 
        message: `La ubicación seleccionada no pertenece al departamento de ${selectedDepartmentName}` 
      };
    }
    
    // Verificar contra la provincia si existe
    if (provincia && currentProvincePolygon && !isPointInPolygon([latlng.lat, latlng.lng], currentProvincePolygon)) {
      return { 
        valid: false, 
        message: `La ubicación seleccionada no pertenece a la provincia de ${provincia}` 
      };
    }
    
    return { valid: true, message: "" };
  };

  const handlePositionChange = (latlng: L.LatLng) => {
    const { valid, message } = checkLocationInRegion(latlng);
    
    if (!valid) {
      setError(message);
      return;
    }
    
    const newPosition: [number, number] = [latlng.lat, latlng.lng];
    setPosition(newPosition);
    setError("");
  };

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker) {
        handlePositionChange(marker.getLatLng());
      }
    },
  };

  return (
    <>
      {currentDepartmentPolygon && (
        <Polygon 
          positions={currentDepartmentPolygon} 
          color="blue" 
          fillOpacity={0.1}
          weight={2}
        />
      )}
      
      {currentProvincePolygon && (
        <Polygon 
          positions={currentProvincePolygon} 
          color="green" 
          fillOpacity={0.1}
          weight={2}
        />
      )}
      
      {position && (
        <Marker
          draggable
          position={position}
          icon={carIcon}
          ref={markerRef}
          eventHandlers={eventHandlers}
        >
          <Popup>Ubicación seleccionada</Popup>
        </Marker>
      )}
      
      <MapClickHandler 
        onMapClick={(latlng) => {
          handlePositionChange(latlng);
          map.setView(latlng, map.getZoom() + 1);
        }}
      />
    </>
  );
}

function MapClickHandler({ onMapClick }: { onMapClick: (latlng: L.LatLng) => void }) {
  useMapEvents({
    dblclick(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

interface CampoMapaProps {
  onLocationSelect: (lat: number | null, lng: number | null) => void;
  onValidationChange: (isValid: boolean) => void;
  initialPosition: [number, number] | null;
  departamento: string;
  provincia: string;
  selectedDepartmentName: string;
  className?: string;
}

export default function CampoMapa({ 
  onLocationSelect, 
  onValidationChange,
  initialPosition,
  departamento,
  provincia,
  selectedDepartmentName,
  className = ""
}: CampoMapaProps) {
  const [position, setPosition] = useState<[number, number] | null>(initialPosition);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [geoError, setGeoError] = useState("");
  const mapRef = useRef<Map>(null);
  const markerPersistedRef = useRef(false);

  // Inicializar posición y manejar persistencia
  useEffect(() => {
    if (!initialPosition && !markerPersistedRef.current) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userPos: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setPosition(userPos);
          setIsLoading(false);
        },
        (err) => {
          console.error("Error al obtener ubicación:", err);
          setGeoError("Permiso de ubicación denegado. Seleccione manualmente.");
          setPosition([-16.5000, -68.1500]); // La Paz por defecto
          setIsLoading(false);
        },
        { timeout: 5000 }
      );
    } else if (initialPosition && !markerPersistedRef.current) {
      setPosition(initialPosition);
      setIsLoading(false);
      markerPersistedRef.current = true;
    }
  }, [initialPosition]);

  // Validar ubicación
  const checkCurrentLocation = useCallback((): { valid: boolean; message: string } => {
    if (!position) return { valid: false, message: "Debe seleccionar una ubicación en el mapa" };
    
    // Verificar si está dentro de Bolivia
    if (!isWithinBolivia(position[0], position[1])) {
      return { 
        valid: false, 
        message: "La ubicación seleccionada está fuera de Bolivia" 
      };
    }
    
    if (!departamento || !selectedDepartmentName) {
      return { valid: false, message: "Debe seleccionar un departamento primero" };
    }
    
    const departmentData = BOLIVIA_DEPARTMENTS.find(p => 
      p.name.toLowerCase() === selectedDepartmentName.toLowerCase()
    );
    
    if (!departmentData) {
      return { valid: false, message: "Departamento no encontrado" };
    }
    
    if (!isPointInPolygon([position[0], position[1]], departmentData.coordinates)) {
      return { 
        valid: false, 
        message: `La ubicación seleccionada no pertenece al departamento de ${selectedDepartmentName}` 
      };
    }
    
    if (provincia) {
      const provinceData = BOLIVIA_DEPARTMENTS.find(p => 
        p.name.toLowerCase() === provincia.toLowerCase()
      );
      
      if (provinceData && !isPointInPolygon([position[0], position[1]], provinceData.coordinates)) {
        return { 
          valid: false, 
          message: `La ubicación seleccionada no pertenece a la provincia de ${provincia}` 
        };
      }
    }
    
    return { valid: true, message: "" };
  }, [position, departamento, provincia, selectedDepartmentName]);

  // Validar cuando cambian los datos
  useEffect(() => {
    if (position && departamento && selectedDepartmentName) {
      const { valid, message } = checkCurrentLocation();
      setError(message);
      onValidationChange(valid);
    } else {
      onValidationChange(false);
    }
  }, [position, departamento, provincia, selectedDepartmentName, checkCurrentLocation]);

  // Notificar cambios de ubicación
  useEffect(() => {
    if (position) {
      onLocationSelect(position[0], position[1]);
    } else {
      onLocationSelect(null, null);
    }
  }, [position, onLocationSelect]);

  // Configurar límites del mapa
  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;
      const bounds = L.latLngBounds(
        L.latLng(BOLIVIA_BOUNDS.southWest[0], BOLIVIA_BOUNDS.southWest[1]),
        L.latLng(BOLIVIA_BOUNDS.northEast[0], BOLIVIA_BOUNDS.northEast[1])
      );
      
      map.setMaxBounds(bounds);
      map.on('drag', () => {
        if (!map.getBounds().intersects(bounds)) {
          map.fitBounds(bounds);
        }
      });
    }
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      <h2 className="text-lg font-medium">Seleccione en el mapa:</h2>
      
      <div className="relative h-96 w-full rounded-md overflow-hidden border border-gray-300">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
            <span className="ml-2">Cargando mapa...</span>
          </div>
        ) : (
          <MapContainer
            center={position || [-16.5000, -68.1500]}
            zoom={position ? 13 : 5}
            style={{ height: "100%", width: "100%", zIndex: 0 }}
            whenReady={() => {
              setIsLoading(false);
              if (mapRef.current) {
                const map = mapRef.current;
                const bounds = L.latLngBounds(
                  L.latLng(BOLIVIA_BOUNDS.southWest[0], BOLIVIA_BOUNDS.southWest[1]),
                  L.latLng(BOLIVIA_BOUNDS.northEast[0], BOLIVIA_BOUNDS.northEast[1])
                );
                map.setMaxBounds(bounds);
                map.on('drag', () => {
                  if (!map.getBounds().intersects(bounds)) {
                    map.fitBounds(bounds);
                  }
                });
              }
            }}
            ref={mapRef}
            touchZoom={true}
            scrollWheelZoom={true}
            doubleClickZoom={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationMarker
              position={position}
              setPosition={setPosition}
              setError={setError}
              departamento={departamento}
              provincia={provincia}
              selectedDepartmentName={selectedDepartmentName}
            />
          </MapContainer>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium">Longitud:</p>
          <p className="text-gray-700">
            {position?.[1]?.toFixed(6) ?? "No seleccionada"}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium">Latitud:</p>
          <p className="text-gray-700">
            {position?.[0]?.toFixed(6) ?? "No seleccionada"}
          </p>
        </div>
      </div>
      
      {error && <p className="text-sm text-red-600">{error}</p>}
      {geoError && <p className="text-sm text-yellow-600">{geoError}</p>}
      
      <p className="text-sm text-gray-600">
        Haga doble clic en el mapa para seleccionar la ubicación y hacer zoom. 
        Arrastre el marcador para ajustar la posición.
      </p>
      
      {selectedDepartmentName && (
        <p className="text-sm text-blue-600">
          Departamento seleccionado: <strong>{selectedDepartmentName}</strong>
        </p>
      )}
    </div>
  );
}