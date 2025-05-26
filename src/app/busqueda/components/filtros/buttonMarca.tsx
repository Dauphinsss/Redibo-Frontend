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
}

export function ButtonMarca({
  onFilterChange,
  disabled = false,
  className = ""
}: ButtonMarcaProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [selectedMarca, setSelectedMarca] = useState<Marca | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Datos mock - reemplazar con llamada al backend
  const mockMarcas: Marca[] = [
    { id: 1, name: 'TOYOTA', models: 45, count: 128 },
    { id: 2, name: 'HONDA', models: 32, count: 95 },
    { id: 3, name: 'NISSAN', models: 28, count: 76 },
    { id: 4, name: 'CHEVROLET', models: 38, count: 112 },
    { id: 5, name: 'FORD', models: 25, count: 68 },
    { id: 6, name: 'HYUNDAI', models: 22, count: 54 },
    { id: 7, name: 'KIA', models: 18, count: 43 },
    { id: 8, name: 'MAZDA', models: 15, count: 32 },
    { id: 9, name: 'VOLKSWAGEN', models: 27, count: 71 },
    { id: 10, name: 'BMW', models: 35, count: 89 },
    { id: 11, name: 'MERCEDES-BENZ', models: 28, count: 45 },
    { id: 12, name: 'AUDI', models: 31, count: 52 }
  ];

  // Simular búsqueda en backend
  useEffect(() => {
    if (searchTerm.length > 0) {
      setLoading(true);
      const timer = setTimeout(() => {
        const filtered = mockMarcas.filter(marca =>
          marca.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setMarcas(filtered);
        setLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setMarcas([]);
    }
  }, [searchTerm]);

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
                className="mr-2 px-1 py-0 text-xs"
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
              onChange={(e) => setSearchTerm(e.target.value)}
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