import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AutoCard_Interfaces_Recode as Auto } from '@/app/busqueda/interface/AutoCard_Interface_Recode';
import { WifiOff } from "lucide-react";


interface Host {
  id: number;
  name: string;
  trips: number;
  rating?: number;
  autosCount: number;
}

interface ButtonHostProps {
  onFilterChange: (host: Host | null) => void;
  disabled?: boolean;
  className?: string;
  autos?: Auto[];
}

export function ButtonHost({
  onFilterChange,
  disabled = false,
  className = "",
  autos = []
}: ButtonHostProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [hosts, setHosts] = useState<Host[]>([]);
  const [allHosts, setAllHosts] = useState<Host[]>([]);
  const [selectedHost, setSelectedHost] = useState<Host | null>(null);
  const [loading, setLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [autocompleteSuggestion, setAutocompleteSuggestion] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [isClient, setIsClient] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showConnectionError, setShowConnectionError] = useState(false);


// Función para verificar conexión real a internet
  const checkInternetConnection = async (): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch('https://www.google.com/favicon.ico', {
        method: 'HEAD',
        mode: 'no-cors',
        signal: controller.signal,
        cache: 'no-cache'
      });
      
      clearTimeout(timeoutId);
      return true;
    } catch (error) {
      return false;
    }
  };

  // Monitorear el estado de la conexión
  useEffect(() => {
    setIsClient(true);
    
    const checkInitialConnection = async () => {
      const reallyOnline = await checkInternetConnection();
      setIsOnline(reallyOnline);
    };

    const handleOnline = async () => {
      const reallyOnline = await checkInternetConnection();
      setIsOnline(reallyOnline);
      if (reallyOnline) {
        setShowConnectionError(false);
      }
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };

    const checkConnection = async () => {
      if (!isClient) return;
      const reallyOnline = await checkInternetConnection();
      setIsOnline(reallyOnline);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    const intervalId = setInterval(checkConnection, 10000);
    
    checkInitialConnection();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(intervalId);
    };
  }, [isClient]);

  // Función para verificar conexión de red antes de acciones
  const checkNetworkConnection = async (): Promise<boolean> => {
    if (!isClient) return true;
    
    if (!navigator.onLine) {
      setIsOnline(false);
      setShowConnectionError(true);
      setTimeout(() => setShowConnectionError(false), 4000);
      return false;
    }

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


  //autocompletado ignora acentos
  const normalizeString = (str: string) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const extractHostsFromAutos = (autosList: Auto[]): Host[] => {
    const hostsMap = new Map<string, { autosCount: number, reservas: number }>();

    autosList.forEach(auto => {
      const hostName = auto.nombreHost;
      if (hostName && hostName !== "Sin nombre") {
        if (!hostsMap.has(hostName)) {
          hostsMap.set(hostName, { autosCount: 0, reservas: 0 });
        }

        const hostData = hostsMap.get(hostName)!;
        hostData.autosCount++;

        if (auto.reservas && Array.isArray(auto.reservas)) {
          hostData.reservas += auto.reservas.filter(r =>
            ['confirmado', 'completado'].includes(r.estado?.toLowerCase() || '')
          ).length;
        }
      }
    });

    return Array.from(hostsMap.entries()).map(([name, data], index) => ({
      id: index + 1,
      name,
      trips: data.reservas,
      rating: 4.5 + Math.random() * 0.4,
      autosCount: data.autosCount
    })).sort((a, b) =>
      normalizeString(a.name).localeCompare(normalizeString(b.name))
    );
  }


  useEffect(() => {
    if (autos.length > 0) {
      const extractedHosts = extractHostsFromAutos(autos);
      setAllHosts(extractedHosts);
    }
  }, [autos]);

  useEffect(() => {
  if (searchTerm.trim().length > 0) {
    setLoading(true);
    const timer = setTimeout(() => {
      const term = searchTerm.trim().replace(/\s{2,}/g, ' ');

      const normalizeString = (str: string) =>
        str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

      const filtered = allHosts.filter(host =>
        normalizeString(host.name).includes(normalizeString(term))
      );
      setHosts(filtered);
      setHighlightedIndex(0);

      const suggestionHost = filtered.find(host =>
        normalizeString(host.name).startsWith(normalizeString(term))
      );
      if (suggestionHost && suggestionHost.name.toLowerCase() !== term.toLowerCase()) {
        setAutocompleteSuggestion(suggestionHost.name);
      } else {
        setAutocompleteSuggestion("");
      }

      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  } else {
    // Cuando el input está vacío
    setHosts(allHosts.slice(0, 10));
    setHighlightedIndex(-1);
    setAutocompleteSuggestion("");
    setLoading(false); 
  }
}, [searchTerm, allHosts]);

  // Scroll automático al ítem resaltado
  useEffect(() => {
    if (highlightedIndex < 0 || highlightedIndex >= itemRefs.current.length) return;
    const node = itemRefs.current[highlightedIndex];
    if (node) {
      node.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex]);

  const handleHostSelect = (host: Host) => {
    setSelectedHost(host);
    onFilterChange(host);
    setSearchTerm(host.name);
    setAutocompleteSuggestion("");
    setIsOpen(false);
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedHost(null);
    onFilterChange(null);
    setSearchTerm('');
    setAutocompleteSuggestion("");
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      if (searchTerm === '') {
        setHosts(allHosts.slice(0, 10));
        setHighlightedIndex(-1);
        setAutocompleteSuggestion("");
      }
    }
  };

  return (
  <div className="relative">
    {/* Mensaje de error de conexión encima del botón */}
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
          className={`w-full justify-between ${className} 
          ${isClient && !isOnline ? 'border-red-300 bg-red-50' : ''} 
          ${selectedHost ? 'border-gray-400 bg-gray-100' : ''} 
          ${isOpen ? 'border-gray-500 shadow-sm' : ''}`}
        >
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span className="truncate">
              {selectedHost ? selectedHost.name : "Filtrar por Host"}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            {isClient && !isOnline && (
              <WifiOff className="w-4 h-4 text-red-500 mr-1" />
            )}
            {selectedHost && (
              <Badge
                variant="secondary"
                className="mr-2 px-1 py-0 text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                onClick={clearSelection}
                title="Limpiar"
              >
                <X className="w-3 h-3" />
              </Badge>
            )}
            <ChevronDown className="w-4 h-4" />
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0" align="start">
        {/* Si no hay conexión, mostrar solo el mensaje y no el buscador ni la lista */}
        {isClient && !isOnline ? (
          <div className="p-4 text-center">
            <WifiOff className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-red-600 font-medium">Sin conexión a internet</p>
            <p className="text-xs text-muted-foreground">
              Verifique su conexión de red para aplicar filtros
            </p>
          </div>
        ) : (
          <>
            <div className="p-3 border-b">
              <div className="relative flex items-center">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  ref={inputRef}
                  value={searchTerm}
                  onChange={(e) => {
                    let value = e.target.value.slice(0, 100); 
                    const onlyValid = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
                    const trimmedValue = onlyValid.trimStart();
                    setSearchTerm(trimmedValue);

                    if (trimmedValue === '') {
                      setSelectedHost(null);
                      onFilterChange(null);
                      setHosts(allHosts.slice(0, 10));
                      setHighlightedIndex(-1);
                      setAutocompleteSuggestion("");
                    }
                  }}
                  onKeyDown={(e) => {
                    if (hosts.length === 0) return;

                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      setHighlightedIndex((prev) => (prev + 1) % hosts.length);
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      setHighlightedIndex((prev) => (prev - 1 + hosts.length) % hosts.length);
                    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
                      e.preventDefault();
                      handleHostSelect(hosts[highlightedIndex]);
                    } else if ((e.key === 'Tab' || e.key === 'ArrowRight') && autocompleteSuggestion) {
                      e.preventDefault();
                      setSearchTerm(autocompleteSuggestion);
                      setAutocompleteSuggestion("");
                    }
                  }}
                  placeholder="Escriba el nombre del host..."
                  className="pl-10"
                  autoComplete="off"
                />

                {autocompleteSuggestion && searchTerm.length > 0 && (
                  <div
                    className="absolute left-10 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none select-none whitespace-nowrap overflow-hidden"
                    style={{
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                      lineHeight: '1.5rem',
                      opacity: 0.5,
                    }}
                  >
                    {autocompleteSuggestion && normalizeString(autocompleteSuggestion).startsWith(normalizeString(searchTerm))
                     ? autocompleteSuggestion
                     : ''}
                  </div>
                )}

                <div className="text-xs text-right text-muted-foreground mt-1">
                  {searchTerm.length}/100 caracteres
                </div>
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center">
                  <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Buscando hosts...</p>
                </div>
              ) : hosts.length > 0 ? (
                <div className="py-1">
                  {hosts.map((host, index) => (
                    <button
                      key={host.id}
                      ref={el => { itemRefs.current[index] = el; }}
                      onClick={() => handleHostSelect(host)}
                      className={`w-full px-4 py-3 text-left transition-colors ${
                        index === highlightedIndex
                          ? 'bg-gray-100 border border-gray-300'
                          : 'hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{host.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {host.autosCount} vehículos • {host.trips} viajes • ⭐ {host.rating?.toFixed(1) || '4.5'}
                          </div>
                        </div>
                        <User className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </button>
                  ))}
                </div>
              ) : searchTerm.length > 0 ? (
                <div className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    No se encontraron hosts con &quot;{searchTerm}&quot;
                  </p>
                </div>
              ) : allHosts.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    No hay hosts disponibles
                  </p>
                </div>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Escribe para buscar hosts
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  </div>
);
}