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

interface Host {
  id: number;
  name: string;
  trips: number;
  rating?: number;
  autosCount: number; // Cantidad de autos del host
}

interface ButtonHostProps {
  onFilterChange: (host: Host | null) => void;
  disabled?: boolean;
  className?: string;
  autos?: Auto[]; // Nueva prop para recibir los autos disponibles
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
  const inputRef = useRef<HTMLInputElement>(null);

  // Función para extraer hosts únicos de los autos
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
        // Contar reservas del auto (trips)
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
      rating: 4.5 + Math.random() * 0.4, // Rating simulado entre 4.5 y 4.9
      autosCount: data.autosCount
    })).sort((a, b) => b.autosCount - a.autosCount); // Ordenar por cantidad de autos
  };

  // Inicializar hosts cuando se reciben los autos
  useEffect(() => {
    if (autos.length > 0) {
      const extractedHosts = extractHostsFromAutos(autos);
      setAllHosts(extractedHosts);
    }
  }, [autos]);

  // Filtrar hosts según el término de búsqueda
  useEffect(() => {
    if (searchTerm.length > 0) {
      setLoading(true);
      const timer = setTimeout(() => {
        const filtered = allHosts.filter(host =>
          host.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setHosts(filtered);
        setLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setHosts(allHosts.slice(0, 10)); // Mostrar los primeros 10 hosts por defecto
    }
  }, [searchTerm, allHosts]);

  const handleHostSelect = (host: Host) => {
    setSelectedHost(host);
    onFilterChange(host);
    setSearchTerm('');
    setIsOpen(false);
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedHost(null);
    onFilterChange(null);
    setSearchTerm('');
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      // Mostrar algunos hosts por defecto cuando se abre
      if (searchTerm === '') {
        setHosts(allHosts.slice(0, 10));
      }
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={`w-full justify-between ${className}`}
        >
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span className="truncate">
              {selectedHost ? selectedHost.name : "Filtrar por Host"}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            {selectedHost && (
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
              value={searchTerm}
              onChange={(e) => {
                const value = e.target.value.slice(0, 50);
                const onlyValid = value.replace(/[^a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ]/g, '');
                setSearchTerm(onlyValid.trim());
              }}
              placeholder="Buscar host por nombre..."
              className="pl-10"
            />
            <div className="text-xs text-right text-muted-foreground mt-1">
              {searchTerm.length}/50 caracteres
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
              {hosts.map((host) => (
                <button
                  key={host.id}
                  onClick={() => handleHostSelect(host)}
                  className="w-full px-4 py-3 text-left hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none transition-colors"
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
      </PopoverContent>
    </Popover>
  );
}