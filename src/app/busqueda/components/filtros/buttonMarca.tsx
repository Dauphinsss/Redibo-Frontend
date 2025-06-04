import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, X, Car, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AutoCard_Interfaces_Recode as Auto } from '@/app/busqueda/interface/AutoCard_Interface_Recode';

interface Marca {
  id: number;
  name: string;
  models: number;
  count: number;
  logo?: string;
}

interface ButtonMarcaProps {
  onFilterChange: (marca: Marca | null) => void;
  disabled?: boolean;
  className?: string;
  autos?: Auto[];
}

export function ButtonMarca({
  onFilterChange,
  disabled = false,
  className = "",
  autos = []
}: ButtonMarcaProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [tempSearchTerm, setTempSearchTerm] = useState(''); // Término temporal mientras se busca
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [allMarcas, setAllMarcas] = useState<Marca[]>([]);
  const [selectedMarca, setSelectedMarca] = useState<Marca | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true); // Inicializar como true para evitar hydration mismatch
  const [showConnectionError, setShowConnectionError] = useState(false);
  const [isClient, setIsClient] = useState(false); // Para saber si estamos en el cliente
  const inputRef = useRef<HTMLInputElement>(null);

  // Función para verificar conexión real a internet
  const checkInternetConnection = async (): Promise<boolean> => {
    try {
      // Intenta hacer una petición a un endpoint rápido
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 segundos timeout
      
      const response = await fetch('https://www.google.com/favicon.ico', {
        method: 'HEAD',
        mode: 'no-cors',
        signal: controller.signal,
        cache: 'no-cache'
      });
      
      clearTimeout(timeoutId);
      return true;
    } catch (error) {
      // Si falla, no hay conexión real
      return false;
    }
  };

  // Monitorear el estado de la conexión
  useEffect(() => {
    // Marcar que estamos en el cliente
    setIsClient(true);
    
    // Verificar estado inicial de conexión
    const checkInitialConnection = async () => {
      const reallyOnline = await checkInternetConnection();
      setIsOnline(reallyOnline);
    };

    const handleOnline = async () => {
      // Verificar conexión real cuando el navegador dice que está online
      const reallyOnline = await checkInternetConnection();
      setIsOnline(reallyOnline);
      if (reallyOnline) {
        setShowConnectionError(false);
      }
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };

    // Verificación periódica cada 10 segundos
    const checkConnection = async () => {
      if (!isClient) return; // Solo verificar si estamos en el cliente
      const reallyOnline = await checkInternetConnection();
      setIsOnline(reallyOnline);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Verificar conexión cada 10 segundos
    const intervalId = setInterval(checkConnection, 10000);
    
    // Verificar inmediatamente al montar el componente
    checkInitialConnection();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(intervalId);
    };
  }, [isClient]);

  // Función para verificar conexión de red antes de acciones
  const checkNetworkConnection = async (): Promise<boolean> => {
    // Solo verificar si estamos en el cliente
    if (!isClient) return true;
    
    // Primero verificar navigator.onLine para casos obvios
    if (!navigator.onLine) {
      setIsOnline(false);
      setShowConnectionError(true);
      setTimeout(() => setShowConnectionError(false), 4000);
      return false;
    }

    // Luego verificar conexión real a internet
    const hasRealConnection = await checkInternetConnection();
    
    if (!hasRealConnection) {
      setIsOnline(false);
      setShowConnectionError(true);
      setTimeout(() => setShowConnectionError(false), 4000);
      return false;
    }

    setIsOnline(true);
    return true;
  };

  // Función para extraer marcas únicas de los autos
  const extractMarcasFromAutos = (autosList: Auto[]): Marca[] => {
    const marcasMap = new Map<string, { models: Set<string>, count: number }>();
    
    autosList.forEach(auto => {
      const marcaName = auto.marca.toUpperCase();
      if (!marcasMap.has(marcaName)) {
        marcasMap.set(marcaName, { models: new Set(), count: 0 });
      }
      
      const marcaData = marcasMap.get(marcaName)!;
      marcaData.models.add(auto.modelo);
      marcaData.count++;
    });

    return Array.from(marcasMap.entries()).map(([name, data], index) => ({
      id: index + 1,
      name,
      models: data.models.size,
      count: data.count
    })).sort((a, b) => a.name.localeCompare(b.name));
  };

  // Inicializar marcas cuando se reciben los autos
  useEffect(() => {
    if (autos.length > 0) {
      const extractedMarcas = extractMarcasFromAutos(autos);
      setAllMarcas(extractedMarcas);
    }
  }, [autos]);

  // Filtrar marcas según el término de búsqueda
  useEffect(() => {
    if (tempSearchTerm.length > 0) {
      setLoading(true);
      const timer = setTimeout(() => {
        const filtered = allMarcas.filter(marca =>
          marca.name.toLowerCase().includes(tempSearchTerm.toLowerCase())
        );
        setMarcas(filtered);
        setLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setMarcas(allMarcas.slice(0, 10));
    }
  }, [tempSearchTerm, allMarcas]);

  const handleMarcaSelect = async (marca: Marca) => {
    // Verificar conexión antes de aplicar el filtro
    const hasConnection = await checkNetworkConnection();
    if (!hasConnection) {
      return;
    }
    
    setSelectedMarca(marca);
    onFilterChange(marca);
    // Limpiar búsquedas al seleccionar
    setSearchTerm('');
    setTempSearchTerm('');
    setIsOpen(false);
  };

  const clearSelection = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // También verificar conexión al limpiar filtro
    const hasConnection = await checkNetworkConnection();
    if (!hasConnection) {
      return;
    }
    
    setSelectedMarca(null);
    onFilterChange(null);
    // Limpiar búsquedas al limpiar selección
    setSearchTerm('');
    setTempSearchTerm('');
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      // Al abrir, resetear el término temporal para mostrar marcas por defecto
      setTempSearchTerm('');
      setTimeout(() => inputRef.current?.focus(), 100);
      // Mostrar algunas marcas por defecto cuando se abre
      setMarcas(allMarcas.slice(0, 10));
    } else {
      // Al cerrar sin seleccionar, limpiar la búsqueda temporal
      // pero mantener searchTerm para la próxima apertura si había una selección previa
      setTempSearchTerm('');
      // Si no hay marca seleccionada, también limpiar searchTerm
      if (!selectedMarca) {
        setSearchTerm('');
      }
    }
  };

  return (
    <div className="relative">
      {/* Mensaje de error de conexión */}
      {showConnectionError && (
        <div className="absolute top-0 left-0 right-0 z-50 bg-red-500 text-white text-sm px-3 py-2 rounded-md shadow-lg transform -translate-y-full mb-2 flex items-center space-x-2">
          <WifiOff className="w-4 h-4" />
          <span>Error de conexión. Verifique su red.</span>
        </div>
      )}
      
      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={`w-full justify-between ${className} ${isClient && !isOnline ? 'border-red-300 bg-red-50' : ''}`}
          >
            <div className="flex items-center space-x-2">
              <Car className="w-4 h-4" />
              <span className="truncate">
                {selectedMarca ? selectedMarca.name : "Filtrar por Marca"}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              {/* Indicador de estado de conexión - solo mostrar en cliente */}
              {isClient && !isOnline && (
                <WifiOff className="w-4 h-4 text-red-500 mr-1" />
              )}
              {selectedMarca && (
                <Badge
                  variant="secondary"
                  className="mr-2 px-1 py-0 text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                  onClick={clearSelection}
                >
                  <X className="w-3 h-3" />
                </Badge>
              )}
              <ChevronDown className="w-4 h-4" />
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-80 p-0" align="start">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                ref={inputRef}
                value={tempSearchTerm}
                onChange={(e) => {
                  const value = e.target.value.slice(0, 50);
                  const onlyValid = value.replace(/[^a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ]/g, '');
                  setTempSearchTerm(onlyValid.trim());
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const filtered = allMarcas.filter(marca =>
                      marca.name.toLowerCase().includes(tempSearchTerm.toLowerCase())
                    );
                    setMarcas(filtered);
                  }
                  // Limpiar búsqueda con Escape
                  if (e.key === 'Escape') {
                    setTempSearchTerm('');
                    setMarcas(allMarcas.slice(0, 10));
                  }
                }}
                placeholder="Buscar marca de vehículo..."
                className="pl-10 border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
              {tempSearchTerm.length >= 45 && (
                <div className="text-xs text-right text-muted-foreground mt-1">
                  {tempSearchTerm.length}/50 caracteres
                </div>
              )}
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto">
            {isClient && !isOnline ? (
              <div className="p-4 text-center">
                <WifiOff className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-sm text-red-600 font-medium">Sin conexión a internet</p>
                <p className="text-xs text-muted-foreground">
                  Verifique su conexión de red para aplicar filtros
                </p>
              </div>
            ) : loading ? (
              <div className="p-4 text-center">
                <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Buscando marcas...</p>
              </div>
            ) : marcas.length > 0 ? (
              <div className="py-1">
                {marcas.map((marca) => (
                  <button
                    key={marca.id}
                    onClick={() => handleMarcaSelect(marca)}
                    className="w-full px-4 py-3 text-left hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{marca.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {marca.models} modelos • {marca.count} vehículos
                        </div>
                      </div>
                      <Car className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </button>
                ))}
              </div>
            ) : tempSearchTerm.length > 0 ? (
              <div className="p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  No se encontraron marcas con &quot;{tempSearchTerm}&quot;
                </p>
              </div>
            ) : allMarcas.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  No hay marcas disponibles
                </p>
              </div>
            ) : (
              <div className="p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Escribe para buscar marcas
                </p>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}