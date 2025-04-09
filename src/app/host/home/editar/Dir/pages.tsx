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

const countries = [
    { label: "Bolivia", value: "Bolivia" },
];

const departments = [
    { label: "Cochabamba", value: "Cochabamba" },
];

const provinces = [
    { label: "Chapare", value: "Chapare" },
];

const SprinterosPage: React.FC = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5' }}>
            <div style={{ textAlign: 'left', padding: '20px', borderRadius: '8px' }}>
                <h2 style={{ fontSize: '40px', marginBottom: '10px', fontFamily:'Inter,sans-serif' }}>Dirección</h2>
                <h3 style={{ fontSize: '33px', color: 'black', marginBottom: '20px',fontFamily:'Inter,sans-serif' }}>Ingrese una ubicación específica</h3>

                <label style={{fontFamily: 'Inter, sans-serif'}}>País</label>
                <select style={{ width: '100%', padding: '8px', marginBottom: '10px',border:'2px solid #000000',borderRadius: '8px' }}>
                    {countries.map((country) => (
                        <option key={country.value} value={country.value}>{country.label}</option>
                    ))}
                </select>

                <label style={{fontFamily: 'Inter, sans-serif'}}>Departamento</label>
                <select style={{ width: '100%', padding: '8px', marginBottom: '10px',border:'2px solid #000000',borderRadius: '8px'  }}>
                    {departments.map((department) => (
                        <option key={department.value} value={department.value}>{department.label}</option>
                    ))}
                </select>

                <label style={{fontFamily: 'Inter, sans-serif'}}>Provincia</label>
                <select style={{ width: '100%', padding: '8px', marginBottom: '10px',border:'2px solid #000000',borderRadius: '8px' }}>
                    {provinces.map((province) => (
                        <option key={province.value} value={province.value}>{province.label}</option>
                    ))}
                </select>

                <label style={{fontFamily: 'Inter, sans-serif'}}>Dirección de la calle</label>
                <input type="text" placeholder="ZONA AROCAGUA, KM4" style={{ width: '100%', padding: '8px', marginBottom: '10px', border:'2px solid #000000',borderRadius: '8px'}} />

                <label>N° Casa</label>
                <input type="text" placeholder="504" style={{ width: '100%', padding: '8px', marginBottom: '20px',border:'2px solid #000000',borderRadius: '8px' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="outline">CANCELAR</Button>
                    <Button variant="outline">FINALIZA EDICIÓN Y GUARDAR</Button>
                </div>
            </div>
        </div>
    );
};

export default SprinterosPage;



