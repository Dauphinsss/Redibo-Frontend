import React from 'react';
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const years = [
    { label: "2025", value: "2025" ,
    
    },
];

const marcs = [
    { label: "MAZDA", value: "MAZDA" },
];

const models = [
    { label: "CX-5", value: "CX-5" },
];

const SprinterosPage: React.FC = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5' }}>
            <div style={{ textAlign: 'left', padding: '20px', borderRadius: '8px' }}>
                <h2 style={{ fontSize: '40px', marginBottom: '20px', fontFamily: 'Inter, sans-serif' }}>Datos principales</h2>                

                <label style={{fontFamily: 'Inter, sans-serif'}}>Numero de Vim</label>
                <input type="text" placeholder="Insertar Numero Vim" style={{ border:'2px solid #000000',borderRadius: '8px',  width: '100%', padding: '8px', marginBottom: '10px' }} />

                

                <label style={{fontFamily: 'Inter, sans-serif'}}>Año del coche</label>
                <select style={{ border:'2px solid #000000',borderRadius: '8px',width: '100%', padding: '8px', marginBottom: '10px' }}>
                    {years.map((year) => (
                        <option key={year.value} value={year.value}>{year.label}</option>
                    ))}
                </select>

                <label style={{fontFamily: 'Inter, sans-serif'}}>Marca</label>
                <select style={{ border:'2px solid #000000',borderRadius: '8px ',width: '100%', padding: '8px', marginBottom: '10px' }}>
                    {marcs.map((mar) => (
                        <option key={mar.value} value={mar.value}>{mar.label}</option>
                    ))}
                </select>

                <label style={{fontFamily: 'Inter, sans-serif'}}>Modelo</label>
                <select style={{ border:'2px solid #000000',borderRadius: '8px', width: '100%', padding: '8px', marginBottom: '10px' }}>
                    {models.map((model) => (
                        <option key={model.value} value={model.value}>{model.label}</option>
                    ))}
                </select>

                

                <label style={{fontFamily: 'Inter, sans-serif'}}>Placa</label>
                <input type="text" placeholder="SDADASD" style={{border:'2px solid #000000',borderRadius: '8px', width: '100%', padding: '8px', marginBottom: '20px' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="outline">CANCELAR</Button>
                    <Button variant="outline">FINALIZA EDICIÓN Y GUARDAR</Button>
                </div>
            </div>
        </div>
    );
};

export default SprinterosPage;
