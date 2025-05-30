import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, X, Car } from 'lucide-react';
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
  autos?: Auto[]; // Nueva prop para recibir los autos disponibles
}

export function ButtonMarca({
  onFilterChange,
  disabled = false,
  className = "",
  autos = []
}: ButtonMarcaProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [allMarcas, setAllMarcas] = useState<Marca[]>([]);
  const [selectedMarca, setSelectedMarca] = useState<Marca | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
    if (searchTerm.length > 0) {
      setLoading(true);
      const timer = setTimeout(() => {
        const filtered = allMarcas.filter(marca =>
          marca.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setMarcas(filtered);
        setLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setMarcas(allMarcas.slice(0, 10)); // Mostrar las primeras 10 marcas por defecto
    }
  }, [searchTerm, allMarcas]);

  const handleMarcaSelect = (marca: Marca) => {
    setSelectedMarca(marca);
    onFilterChange(marca);
    setSearchTerm('');
    setIsOpen(false);
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedMarca(null);
    onFilterChange(null);
    setSearchTerm('');
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      // Mostrar algunas marcas por defecto cuando se abre
      if (searchTerm === '') {
        setMarcas(allMarcas.slice(0, 10));
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
            <Car className="w-4 h-4" />
            <span className="truncate">
              {selectedMarca ? selectedMarca.name : "Filtrar por Marca"}
            </span>
          </div>
          <div className="flex items-center space-x-1">
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
              value={searchTerm}
              //onChange={(e) => setSearchTerm(e.target.value)}
              //onChange={(e) => setSearchTerm(e.target.value.trimStart())}// ingnora espacios
              onChange={(e) => {
                const value = e.target.value;
                const onlyValid = value.replace(/[^a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ]/g, '');
                setSearchTerm(onlyValid.trimStart());
              }}
              placeholder="Buscar marca de vehículo..."
              className="pl-10"
            />
          </div>
        </div>

        <div className="max-h-60 overflow-y-auto">
          {loading ? (
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
          ) : searchTerm.length > 0 ? (
            <div className="p-4 text-center">
              <p className="text-sm text-muted-foreground">
                No se encontraron marcas con &quot;{searchTerm}&quot;
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
  );
}