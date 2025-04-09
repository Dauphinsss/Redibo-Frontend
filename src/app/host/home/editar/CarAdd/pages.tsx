import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const items = [
{ id: "air-conditioning", label: "Aire acondicionado" },
{ id: "bluetooth", label: "Bluetooth" },
{ id: "gps", label: "GPS" },
{ id: "bike-rack", label: "Portabicicletas" },
{ id: "ski-stand", label: "Soporte para esquís" },
{ id: "touch-screen", label: "Pantalla táctil" },
{ id: "baby-seat", label: "Sillas para bebé" },
{ id: "reverse-camera", label: "Cámara de reversa" },
{ id: "leather-seats", label: "Asientos de cuero" },
{ id: "anti-theft", label: "Sistema antirrobo" },
{ id: "roof-rack", label: "Toldo o rack de techo" },
{ id: "polarized-glass", label: "Vidrios polarizados" },
{ id: "checkbox", label: "Checkbox" },
{ id: "sound-system", label: "Sistema de sonido" },
];

const CheckboxList: React.FC = () => {
return (
    <div
    style={{
        display: "grid",
        gridTemplateColumns: "5fr 5fr",
        gap: "10px",
        marginBottom: "20px",
    }}
    >
    {items.map((item) => (
        <div key={item.id} style={{ display: "flex", alignItems: "center" }}>
        <Checkbox id={item.id} />
        <label htmlFor={item.id} style={{ marginLeft: "8px" }}>
        {item.label}
        </label>
        </div>
    ))}
    </div>
);
};

const SprinterosPage: React.FC = () => {
return (
    <div
    style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
    }}
    >
    <div style={{ textAlign: "left", padding: "20px", borderRadius: "8px" }}>
        <h2
        style={{
            fontSize: "40px",
            marginBottom: "20px",
            fontFamily: "Inter, sans-serif",
        }}
        >
        Características Adicionales
        </h2>

        <CheckboxList />

        <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button variant="outline">CANCELAR</Button>
        <Button variant="outline">FINALIZA EDICIÓN Y GUARDAR</Button>
        </div>
    </div>
    </div>
);
};

export default SprinterosPage;