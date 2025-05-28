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

interface Host {
  id: number;
  name: string;
  trips: number;
  rating?: number;
}

interface ButtonHostProps {
  onFilterChange: (host: Host | null) => void;
  disabled?: boolean;
  className?: string;
}

export function ButtonHost({
  onFilterChange,
  disabled = false,
  className = ""
}: ButtonHostProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [hosts, setHosts] = useState<Host[]>([]);
  const [selectedHost, setSelectedHost] = useState<Host | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Datos mock - reemplazar con llamada al backend
  const mockHosts: Host[] = [
    { id: 1, name: 'FRANKLIN EMANUEL', trips: 15, rating: 4.8 },
    { id: 2, name: 'FRANCISCO LA TORRE', trips: 23, rating: 4.9 },
    { id: 3, name: 'FRANCO GUZMAN', trips: 8, rating: 4.5 },
    { id: 4, name: 'FERNANDO MARTINEZ', trips: 12, rating: 4.7 },
    { id: 5, name: 'FABIANA RODRIGUEZ', trips: 19, rating: 4.6 },
    { id: 6, name: 'FELIX SANTOS', trips: 7, rating: 4.4 },
    { id: 7, name: 'FABIAN TORRES', trips: 31, rating: 4.9 },
    { id: 8, name: 'FRANCISCA MORALES', trips: 16, rating: 4.8 }
  ];

  // Simular búsqueda en backend
  useEffect(() => {
    if (searchTerm.length > 0) {
      setLoading(true);
      const timer = setTimeout(() => {
        const filtered = mockHosts.filter(host =>
          host.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setHosts(filtered);
        setLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setHosts([]);
    }
  }, [searchTerm]);

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
              placeholder="Buscar host por nombre..."
              className="pl-10"
            />
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
                        {host.trips} viajes • ⭐ {host.rating}
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

