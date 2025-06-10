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
  const [tempSearchTerm, setTempSearchTerm] = useState('');
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [allMarcas, setAllMarcas] = useState<Marca[]>([]);
  const [selectedMarca, setSelectedMarca] = useState<Marca | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showConnectionError, setShowConnectionError] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const listRef = useRef<HTMLDivElement>(null);
  const [autocompleteSuggestion, setAutocompleteSuggestion] = useState('');

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

  // Función para hacer scroll al elemento seleccionado
  const scrollToSelectedItem = (index: number) => {
    if (listRef.current && index >= 0) {
      const listItems = listRef.current.querySelectorAll('[data-item-index]');
      const selectedItem = listItems[index] as HTMLElement;
      if (selectedItem) {
        selectedItem.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    }
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
        setSelectedIndex(-1); // Reset selected index when filtering
        
        // Buscar sugerencia de autocompletado
        const suggestion = allMarcas.find(marca =>
          marca.name.toLowerCase().startsWith(tempSearchTerm.toLowerCase()) &&
          marca.name.toLowerCase() !== tempSearchTerm.toLowerCase()
        );
        
        if (suggestion && tempSearchTerm.length > 0) {
          setAutocompleteSuggestion(suggestion.name);
        } else {
          setAutocompleteSuggestion('');
        }
        
        setLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setMarcas(allMarcas.slice(0, 10));
      setSelectedIndex(-1); // Reset selected index
      setAutocompleteSuggestion('');
    }
  }, [tempSearchTerm, allMarcas]);

  // Scroll al elemento seleccionado cuando cambia el índice
  useEffect(() => {
    if (selectedIndex >= 0) {
      scrollToSelectedItem(selectedIndex);
    }
  }, [selectedIndex]);

  const handleMarcaSelect = async (marca: Marca) => {
    const hasConnection = await checkNetworkConnection();
    if (!hasConnection) {
      return;
    }
    
    setSelectedMarca(marca);
    onFilterChange(marca);
    setSearchTerm('');
    setTempSearchTerm('');
    setAutocompleteSuggestion('');
    setSelectedIndex(-1);
    setIsOpen(false);
  };

  const clearSelection = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const hasConnection = await checkNetworkConnection();
    if (!hasConnection) {
      return;
    }
    
    setSelectedMarca(null);
    onFilterChange(null);
    setSearchTerm('');
    setTempSearchTerm('');
    setAutocompleteSuggestion('');
    setSelectedIndex(-1);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setTempSearchTerm('');
      setAutocompleteSuggestion('');
      setSelectedIndex(-1);
      setTimeout(() => inputRef.current?.focus(), 100);
      setMarcas(allMarcas.slice(0, 10));
    } else {
      setTempSearchTerm('');
      setAutocompleteSuggestion('');
      setSelectedIndex(-1);
      if (!selectedMarca) {
        setSearchTerm('');
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch(e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => {
          const newIndex = prev < marcas.length - 1 ? prev + 1 : 0;
          return newIndex;
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => {
          const newIndex = prev > 0 ? prev - 1 : marcas.length - 1;
          return newIndex;
        });
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < marcas.length && marcas[selectedIndex]) {
          handleMarcaSelect(marcas[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
      case 'Tab':
        e.preventDefault();
        // Si hay sugerencia de autocompletado, usar esa
        if (autocompleteSuggestion && tempSearchTerm.length > 0) {
          setTempSearchTerm(autocompleteSuggestion);
          setAutocompleteSuggestion('');
        }
        // Si hay un elemento seleccionado en la lista, seleccionarlo
        else if (selectedIndex >= 0 && selectedIndex < marcas.length) {
          handleMarcaSelect(marcas[selectedIndex]);
        }
        break;
      case 'ArrowRight':
        // También permitir flecha derecha para autocompletar
        if (autocompleteSuggestion && tempSearchTerm.length > 0) {
          e.preventDefault();
          setTempSearchTerm(autocompleteSuggestion);
          setAutocompleteSuggestion('');
        }
        break;
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
              
              {/* Input fantasma para mostrar la sugerencia */}
              {autocompleteSuggestion && tempSearchTerm && (
                <Input
                  value={autocompleteSuggestion}
                  readOnly
                  className="pl-10 border border-gray-300 absolute inset-0 text-gray-400 pointer-events-none bg-transparent"
                  style={{ zIndex: 1 }}
                />
              )}
              
              {/* Input real */}
              <Input
                ref={inputRef}
                value={tempSearchTerm}
                onChange={(e) => {
                  const value = e.target.value.slice(0, 50);
                  //const onlyValid = value.replace(/[^a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ]/g, '');
                  const onlyValid = value.replace(/[^a-zA-Z\sáéíóúÁÉÍÓÚñÑ]/g, '');//NO PERMITE NUMEROS, PREGUNTAR PARA LO DEL GUION Y NUEMROS
                  setTempSearchTerm(onlyValid.trim());
                }}
                onKeyDown={handleKeyDown}
                placeholder="Escriba el nombre de la mar"
                className="pl-10 border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-transparent relative z-10"
                style={{ backgroundColor: 'transparent' }}
                role="combobox"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                aria-activedescendant={selectedIndex >= 0 ? `marca-option-${selectedIndex}` : undefined}
              />
              
              {tempSearchTerm.length >= 45 && (
                <div className="text-xs text-right text-muted-foreground mt-1">
                  {tempSearchTerm.length}/50 caracteres
                </div>
              )}
              
              {/* Indicador visual de autocompletado */}
              {autocompleteSuggestion && tempSearchTerm && (
                <div className="text-xs text-muted-foreground mt-1 flex items-center space-x-1">
                  <span>Presiona</span>
                  <kbd className="px-1 py-0.5 text-xs bg-gray-100 border border-gray-300 rounded">Tab</kbd>
                  <span>o</span>
                  <kbd className="px-1 py-0.5 text-xs bg-gray-100 border border-gray-300 rounded">→</kbd>
                  <span>para completar</span>
                </div>
              )}
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto" ref={listRef}>
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
              <div className="py-1" role="listbox">
                {marcas.map((marca, index) => (
                  <button
                    key={marca.id}
                    onClick={() => handleMarcaSelect(marca)}
                    data-item-index={index}
                    id={`marca-option-${index}`}
                    role="option"
                    aria-selected={selectedIndex === index}
                    className={`w-full px-4 py-3 text-left hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none transition-colors ${
                      selectedIndex === index ? 'bg-accent text-accent-foreground' : ''
                    }`}
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