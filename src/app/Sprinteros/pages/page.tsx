import React from 'react';
import { Button } from "@/components/ui/button";

const SprinterosPage: React.FC = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5' }}>
            <div style={{ textAlign: 'center' }}>
                <h2>Dirección</h2>
                <h3>Ingrese una ubicación específica</h3>
                <label>País</label><br></br>
                <label>Departamento</label><br></br>
                <label>Provincia</label><br></br>
                <label>Dirección</label><br></br>
                <label>N</label><br></br>
                <Button variant="outline">CANCELAR</Button>
                <Button variant="outline">FINALIZA EDICIÓN Y GUARDAR</Button>
            </div>
        </div>
    );
};

export default SprinterosPage;