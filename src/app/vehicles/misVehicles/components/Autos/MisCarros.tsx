"use client";

import { useState, useEffect, useCallback } from 'react';
import { API_URL } from "@/utils/bakend";
import dynamic from 'next/dynamic';
const AlertsPanelClient = dynamic(() => import('./AlertsPanel.client'), { ssr: false });

interface BackendCarResponse {
  id: number;
  vim?: string;
  vin?: string;
  anio?: number;
  año?: number;
  marca: string;
  modelo: string;
  placa: string;
  asientos: number;
  puertas: number;
  soat: boolean;
  precio_por_dia: number;
  num_mantenimientos: number;
  transmision?: string;
  transmicion?: string;
  estado: string;
  direccion?: string;
  ciudad?: string;
  provincia?: string;
  pais?: string;
  combustibles?: { tipoDeCombustible: string }[];
  caracteristicas?: { nombre: string }[];
  imagenes?: { url: string, public_id: string }[];
  num_casa?: string;
}

interface Car {
  id: number;
  vim: string;
  anio: number;
  marca: string;
  modelo: string;
  placa: string;
  asientos: number;
  puertas: number;
  soat: boolean;
  precio_por_dia: number;
  num_mantenimientos: number;
  transmision: string;
  estado: string;
  direccion: {
    calle: string;
    num_casa: string;
    provincia: {
      nombre: string;
      ciudad: {
        nombre: string;
      };
    };
  };
  combustiblesporCarro: {
    combustible: {
      tipoDeCombustible: string;
    };
  }[];
  caracteristicasAdicionalesCarro: {
    carasteristicasAdicionales: {
      nombre: string;
    };
  }[];
  imagenes: {
    data: string;
    public_id?: string;
  }[];
}

interface CarDashboardProps {
  hostId: string;
}


interface AlertCard {
    id: string; 
    type: 'reservas' | 'mantenimientos' | 'inactivos' | 'calificaciones'; 
    title: string;
    bgColor: string;
    textColor: string;
    icon: JSX.Element; 
    href: string;
}


interface InactiveCarListItem {
    id: number;
    marca: string;
    modelo: string;
    placa?: string; 
    año?: number;
    Reserva?: Array<{ fecha_fin: string }>;
}

function tiempoInactivo(fechaISO?: string) {
    if (!fechaISO) return "Nunca ha tenido reservas";
    const fecha = new Date(fechaISO);
    const ahora = new Date();
    const diffMs = ahora.getTime() - fecha.getTime();
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDias === 0) return "Inactivo desde hoy";
    if (diffDias === 1) return "Inactivo desde ayer";
    return `Inactivo desde hace ${diffDias} días`;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Esta interfaz se usa en el componente AlertsPanelClient
interface AlertsPanelProps {
    alertas: {
        proximasReservas: number;
        mantenimientos: number;
        vehiculosInactivos: number;
        calificacionesPendientes: number;
    };
    initialAlertsOrder: AlertCard[];
    refreshAlerts: () => void;
    inactiveCarsList: InactiveCarListItem[];
    pendingMaintenanceCarsList: Car[];
    mostrarCartilla: null | 'inactivos' | 'mantenimientos';
    setMostrarCartilla: (tipo: null | 'inactivos' | 'mantenimientos') => void;
}

const CarDashboard = ({ hostId }: CarDashboardProps) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugResponse, setDebugResponse] = useState<Record<string, unknown> | null>(null);
  const [selectedCarId, setSelectedCarId] = useState<number | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- stats se usa en el componente
  const [stats, setStats] = useState<{total: number, autos_con_placa: number} | null>(null);

  
  const [inactiveCarsList, setInactiveCarsList] = useState<InactiveCarListItem[]>([]);

  
  const [pendingMaintenanceCarsList, setPendingMaintenanceCarsList] = useState<Car[]>([]);

  
  const [alertas, setAlertas] = useState({
    proximasReservas: 0,
    mantenimientos: 0,
    vehiculosInactivos: 0,
    calificacionesPendientes: 0,
  });

  
  const initialAlertsOrder: AlertCard[] = [
    {
        id: 'proximasReservas',
        type: 'reservas',
        title: 'Próximas Reservas',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
        icon: (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>),
        href: '/reservas/proximas',
    },
    {
        id: 'mantenimientos',
        type: 'mantenimientos',
        title: 'Mantenimientos',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        icon: (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 6a3 3 0 11-6 0 3 3 0 016 0zm4 14a6 6 0 01-12 0h12zm6-3a3 3 0 11-6 0 3 3 0 016 0zm-4 3a6 6 0 01-12 0h12z" /></svg>),
        href: '/mantenimientos/pendientes',
    },
    {
        id: 'vehiculosInactivos',
        type: 'inactivos',
        title: 'Vehículos Inactivos',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        icon: (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>),
        href: '/vehicles/inactivos',
    },
    {
        id: 'calificacionesPendientes',
        type: 'calificaciones',
        title: 'Calificaciones pendientes',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        icon: (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.329 1.176l1.519 4.674c.3.921-.755 1.688-1.539 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.539-1.118l1.519-4.674a1 1 0 00-.329-1.176l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z" /></svg>),
        href: '/calificaciones/pendientes/host',
    },
  ];

  
  // const onDragEnd = (result: DropResult) => { ... };

  
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setDebugResponse(null);

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        console.error("No se encontró el token de autenticación");
        setLoading(false); 
        return; 
      }

      const carsUrl = `${API_URL}/api/carros/${hostId}`;
      const proximasReservasUrl = `${API_URL}/api/reservas/proximas/${hostId}`;
      const vehiculosInactivosCountUrl = `${API_URL}/api/carros/inactivos/${hostId}`;
      const vehiculosInactivosListUrl = `${API_URL}/api/carros/inactivos-list/${hostId}`;
      const pendingCalificationsUrl = `${API_URL}/api/calificaciones-reserva/count-pending-host?hostId=${hostId}`;
      const mantenimientosVencidosUrl = `${API_URL}/api/mantenimiento/mantenimientos-vencidos/${hostId}`;

      const [carsResponse, proximasReservasResponse, vehiculosInactivosCountResponse, vehiculosInactivosListResponse, calificacionesResponse, mantenimientosResponse] = await Promise.all([
        fetch(carsUrl, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(proximasReservasUrl, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(vehiculosInactivosCountUrl, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(vehiculosInactivosListUrl, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(pendingCalificationsUrl, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(mantenimientosVencidosUrl, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      let totalMantenimientos = 0;
      let formattedCars: Car[] = [];
      let carsWithPendingMaintenance: Car[] = [];
      
      if (carsResponse.ok) {
        const carsData = await carsResponse.json();
        
        if (carsData.autos && Array.isArray(carsData.autos)) {
          formattedCars = carsData.autos.map((car: BackendCarResponse) => {
               return {
                  id: car.id,
                  vim: car.vim || car.vin || '',
                  anio: car.anio || car.año || 0,
                  marca: car.marca || '',
                  modelo: car.modelo || '',
                  placa: car.placa || '',
                  asientos: car.asientos || 0,
                  puertas: car.puertas || 0,
                  soat: car.soat || false,
                  precio_por_dia: car.precio_por_dia || 0,
                  num_mantenimientos: car.num_mantenimientos || 0,
                  transmision: car.transmision || car.transmicion || '',
                  estado: car.estado === 'Disponible' ? 'DISPONIBLE' : 
                         car.estado === 'Reservado' ? 'RESERVADO' : 'MANTENIMIENTO',
                  direccion: {
                    calle: car.direccion || '',
                    num_casa: car.num_casa || '',
                    provincia: {
                      nombre: car.provincia || '',
                      ciudad: {
                        nombre: car.ciudad || ''
                      }
                    }
                  },
                  combustiblesporCarro: car.combustibles ? 
                    car.combustibles.map(c => ({
                      combustible: { tipoDeCombustible: typeof c === 'string' ? c : c.tipoDeCombustible }
                    })) : [],
                  caracteristicasAdicionalesCarro: car.caracteristicas ? 
                    car.caracteristicas.map(c => ({
                      carasteristicasAdicionales: { nombre: typeof c === 'string' ? c : c.nombre }
                    })) : [],
                  imagenes: car.imagenes ? 
                    car.imagenes.map(img => ({
                      data: img.url,
                      public_id: img.public_id
                    })) : []
                };
          });
          
          setCars(formattedCars); 
          setStats({
            total: carsData.total || 0,
            autos_con_placa: carsData.autos_con_placa || 0
          });
        }
      }

      // Procesar mantenimientos vencidos
      if (mantenimientosResponse.ok) {
        const mantenimientosData = await mantenimientosResponse.json();
        if (Array.isArray(mantenimientosData)) {
          totalMantenimientos = mantenimientosData.length;
          carsWithPendingMaintenance = formattedCars.filter(car => 
            mantenimientosData.some(mant => mant.Carro.id === car.id)
          );
          setPendingMaintenanceCarsList(carsWithPendingMaintenance);
        }
      }

      let totalProximasReservas = 0;
      if (proximasReservasResponse.ok) {
        const data = await proximasReservasResponse.json();
        if (data.count !== undefined && typeof data.count === 'number') {
           totalProximasReservas = data.count;
        } else {
           console.error("Formato de respuesta inesperado para próximas reservas (conteo):", data);
         }
      }

      let totalVehiculosInactivos = 0;
      if (vehiculosInactivosCountResponse.ok) {
        const data = await vehiculosInactivosCountResponse.json();
        if (data.count !== undefined && typeof data.count === 'number') {
          totalVehiculosInactivos = data.count;
        } else {
          console.error("Formato de respuesta inesperado para conteo de vehículos inactivos:", data);
        }
      }

      let listaVehiculosInactivos: InactiveCarListItem[] = [];
      if (vehiculosInactivosListResponse.ok) {
           const data = await vehiculosInactivosListResponse.json();
           if (Array.isArray(data)) {
               listaVehiculosInactivos = data as InactiveCarListItem[]; 
           } else {
               console.error("Formato de respuesta inesperado para lista de vehículos inactivos:", data);
           }
      }

      let totalCalificacionesPendientes = 0;
      if (calificacionesResponse.ok) {
        const calificacionesData = await calificacionesResponse.json();
        if (calificacionesData && typeof calificacionesData.count === 'number') {
          totalCalificacionesPendientes = calificacionesData.count;
        } else {
           console.error("Formato de respuesta inesperado para conteo de calificaciones pendientes:", calificacionesData);
        }
      }

      setAlertas({
        proximasReservas: totalProximasReservas,
        mantenimientos: totalMantenimientos,
        vehiculosInactivos: totalVehiculosInactivos,
        calificacionesPendientes: totalCalificacionesPendientes,
      });
      setInactiveCarsList(listaVehiculosInactivos);

    } catch (err) {
      console.error("Error en fetchAllData completo:", err);
      if (!(err instanceof Error && err.message === "No se encontró el token de autenticación")) {
         setError(err instanceof Error ? err.message : 'Error desconocido durante la actualización.');
      }
    } finally {
      setLoading(false); 
    }
  }, [hostId]);

  const refreshAlerts = useCallback(() => {
    fetchAllData();
  }, [fetchAllData]);

  useEffect(() => {
    fetchAllData();

    const intervalId = setInterval(fetchAllData, 60000); 

    const handleFocusOrVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Window focused or tab visible, refetching data...');
        fetchAllData(); 
      }
    };

    window.addEventListener('focus', handleFocusOrVisibilityChange);
    document.addEventListener('visibilitychange', handleFocusOrVisibilityChange);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('focus', handleFocusOrVisibilityChange);
      document.removeEventListener('visibilitychange', handleFocusOrVisibilityChange);
    };
  }, [fetchAllData]); 

  const selectedCar = cars.find(car => car.id === selectedCarId);

  const [mostrarCartilla, setMostrarCartilla] = useState<null | 'inactivos' | 'mantenimientos'>(null);

  if (loading && cars.length === 0 && !error) {
    return <div className="p-6 text-center">Cargando autos y alertas...</div>;
  }

  if (error && cars.length === 0 && !loading) {
     return (
       <div className="p-6 text-center">
         <div className="text-red-500 mb-4">{error}</div>
         {debugResponse && (
           <div className="mt-4 p-4 border rounded bg-gray-50 text-sm max-h-96 overflow-auto">
             <h3 className="font-semibold mb-2">Respuesta del servidor:</h3>
             <pre className="whitespace-pre-wrap text-left">
               {JSON.stringify(debugResponse, null, 2)}
             </pre>
           </div>
         )}
       </div>
     );
  }

  
   if (!loading && cars.length === 0 && alertas.proximasReservas === 0 && alertas.mantenimientos === 0 && alertas.vehiculosInactivos === 0 && alertas.calificacionesPendientes === 0) {
     return (
       <div className="p-6 text-center">
         <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Mis Vehículos y Panel de Alertas</h1>
         <div className="bg-gray-50 p-8 rounded-lg shadow-sm max-w-2xl mx-auto">
           <p className="text-gray-600 text-lg mb-4">No tienes autos registrados ni alertas pendientes.</p>
           <p className="text-gray-500">Parece que aún no tienes vehículos agregados o no hay actividad reciente que genere alertas.</p>
         </div>
       </div>
     );
   }

  return (
    <div className="p-2 sm:p-6 max-w-6xl mx-auto">
      {/* Panel de Alertas - Importado dinámicamente */}
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Panel de Alertas</h1>
      {/* Renderizar el componente cliente pasándole los datos necesarios */}
      <AlertsPanelClient 
        alertas={alertas} 
        initialAlertsOrder={initialAlertsOrder} 
        refreshAlerts={refreshAlerts}
        inactiveCarsList={inactiveCarsList}
        pendingMaintenanceCarsList={pendingMaintenanceCarsList}
        mostrarCartilla={mostrarCartilla}
        setMostrarCartilla={setMostrarCartilla}
      />

      {/* Cartilla amarilla solo si corresponde */}
      {mostrarCartilla === 'inactivos' && inactiveCarsList.length > 0 && (
        <div id="inactive-vehicles-list" className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-yellow-800 mb-3">Vehículos Inactivos ({inactiveCarsList.length})</h2>
          <ul className="list-disc list-inside text-yellow-700">
            {inactiveCarsList.map(car => (
              <li key={car.id} className="text-sm sm:text-base">
                {car.marca} {car.modelo} ({car.placa || 'Sin placa'})
                <br />
                <span className="text-yellow-800 text-xs">
                  {tiempoInactivo(car.Reserva?.[0]?.fecha_fin)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {mostrarCartilla === 'mantenimientos' && pendingMaintenanceCarsList.length > 0 && (
        <div id="pending-maintenance-list" className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-yellow-800 mb-3">Vehículos con Mantenimientos Pendientes ({pendingMaintenanceCarsList.length})</h2>
          <ul className="list-disc list-inside text-yellow-700">
            {pendingMaintenanceCarsList.map(car => (
              <li key={car.id} className="text-sm sm:text-base">
                {car.marca} {car.modelo} ({car.placa || 'Sin placa'}) - {car.num_mantenimientos} {car.num_mantenimientos === 1 ? 'revisión pendiente' : 'revisiones pendientes'}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tablero de Estado de Automóviles */}
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Tablero de Estado de Automóviles</h1>
      
      {/* Listado de vehículos en tarjetas */}
       {loading && cars.length === 0 && !error ? (
         <div className="p-6 text-center">Cargando autos...</div>
       ) : error && cars.length === 0 ? (
         <div className="p-6 text-center text-red-500">Error al cargar autos: {error}</div>
       ) : cars.length === 0 ? (
         <div className="bg-gray-50 p-8 rounded-lg shadow-sm max-w-2xl mx-auto text-center">
           <p className="text-gray-600 text-lg mb-4">No tienes autos registrados</p>
           <p className="text-gray-500">Parece que aún no has agregado ningún vehículo a tu flota.</p>
           <p className="text-gray-500 mt-2">Puedes agregar un nuevo vehículo utilizando el botón correspondiente.</p>
         </div>
       ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
           {cars.map((car) => (
             <div 
               key={car.id}
               className={`border rounded-lg p-3 cursor-pointer transition-all overflow-hidden ${
                 selectedCarId === car.id 
                   ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50' 
                   : 'hover:border-gray-300 hover:bg-gray-50'
               }`}
               onClick={() => setSelectedCarId(car.id)}
             >
               <div className="flex justify-between items-start">
                 <div className="truncate mr-2">
                   <h3 className="font-bold text-base sm:text-lg truncate">{car.marca} {car.modelo}</h3>
                   <p className="text-gray-600 text-sm truncate">{car.anio} • {car.placa}</p>
                 </div>
                 <span className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ${
                   car.estado === 'DISPONIBLE' 
                     ? 'bg-green-100 text-green-800' 
                     : car.estado === 'RESERVADO'
                       ? 'bg-yellow-100 text-yellow-800'
                       : 'bg-red-100 text-red-800'
                 }`}>
                   {car.estado}
                 </span>
               </div>
               <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 text-sm">
                 <div className="truncate"><span className="text-gray-500">Transmisión:</span> {car.transmision}</div>
                 <div className="truncate"><span className="text-gray-500">Precio/día:</span> ${car.precio_por_dia}</div>
                 <div className="truncate">
                   <span className="text-gray-500">Combustible:</span> 
                   {car.combustiblesporCarro && car.combustiblesporCarro[0]?.combustible?.tipoDeCombustible || 'No especificado'}
                 </div>
                 <div className="truncate">
                   <span className="text-gray-500">Ciudad:</span> 
                   {car.direccion?.provincia?.ciudad?.nombre || 'Ciudad no especificada'}
                 </div>
               </div>
             </div>
           ))}
         </div>
       )}

      {/* Detalle del vehículo seleccionado */}
      {selectedCar ? (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md overflow-x-hidden">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-lg sm:text-xl font-semibold truncate mr-2">
              {selectedCar.marca} {selectedCar.modelo} ({selectedCar.anio})
            </h2>
            <button 
              onClick={() => setSelectedCarId(null)}
              className="text-gray-500 hover:text-gray-700 flex-shrink-0"
            >
              Cerrar detalle
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 sm:p-4 rounded">
                <h3 className="font-medium text-gray-700 mb-2">Información del Vehículo</h3>
                <div className="space-y-1 sm:space-y-2 text-sm sm:text-base">
                  <p className="truncate"><strong>VIM:</strong> {selectedCar.vim}</p>
                  <p className="truncate"><strong>Placa:</strong> {selectedCar.placa || 'No registrada'}</p>
                  <p className="truncate"><strong>Transmisión:</strong> {selectedCar.transmision}</p>
                  <p className="truncate"><strong>Asientos/Puertas:</strong> {selectedCar.asientos} / {selectedCar.puertas}</p>
                  <p className="truncate"><strong>SOAT:</strong> {selectedCar.soat ? 'Vigente' : 'No vigente'}</p>
                  <p className="truncate"><strong>Mantenimientos:</strong> {selectedCar.num_mantenimientos}</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 sm:p-4 rounded">
                <h3 className="font-medium text-gray-700 mb-2">Ubicación</h3>
                <p className="truncate text-sm sm:text-base">{selectedCar.direccion?.calle} {selectedCar.direccion?.num_casa && `#${selectedCar.direccion.num_casa}`}</p>
                <p className="truncate text-sm sm:text-base">{selectedCar.direccion?.provincia?.ciudad?.nombre || 'Ciudad no especificada'}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className={`p-3 sm:p-4 rounded ${
                selectedCar.estado === 'DISPONIBLE' 
                  ? 'bg-green-50 border-green-200' 
                  : selectedCar.estado === 'RESERVADO'
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-red-50 border-red-200'
              } border`}>
                <h3 className="font-medium text-gray-700 mb-2">Estado Actual</h3>
                <div className="flex items-center justify-between">
                  <span className="text-base sm:text-lg font-semibold">{selectedCar.estado}</span>
                  <div className="text-2xl sm:text-3xl">
                    {selectedCar.estado === 'DISPONIBLE' ? '✅' : 
                     selectedCar.estado === 'RESERVADO' ? '🕒' : '⛔'}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-blue-50 p-3 sm:p-4 rounded border border-blue-100">
                  <p className="text-xs sm:text-sm text-blue-600">Precio por día</p>
                  <p className="text-xl sm:text-2xl font-bold">${selectedCar.precio_por_dia}</p>
                </div>
                <div className="bg-purple-50 p-3 sm:p-4 rounded border border-purple-100">
                  <p className="text-xs sm:text-sm text-purple-600">Combustible</p>
                  <p className="text-xl sm:text-2xl font-bold truncate">
                    {selectedCar.combustiblesporCarro && selectedCar.combustiblesporCarro[0]?.combustible?.tipoDeCombustible || 'No especificado'}
                  </p>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-3 sm:p-4 rounded border border-yellow-100">
                <h3 className="font-medium text-gray-700 mb-2">Características</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCar.caracteristicasAdicionalesCarro && 
                   selectedCar.caracteristicasAdicionalesCarro.length > 0 ? (
                    selectedCar.caracteristicasAdicionalesCarro.map((caracteristica, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 rounded text-xs sm:text-sm">
                        {caracteristica.carasteristicasAdicionales.nombre}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs sm:text-sm text-gray-500">No hay características registradas</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg text-center text-gray-500">
          Seleccione un vehículo para ver detalles completos
        </div>
      )}
    </div>
  );
};

export default CarDashboard;