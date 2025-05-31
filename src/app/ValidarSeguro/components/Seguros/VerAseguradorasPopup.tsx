"use client";

import { useState } from "react";
import ListaAseguradoras_Recode from "./ListaAseguradoras_Recode";
import Modal_Recode from "./Modal_Recode";

const aseguradoras = [
    { id: 1, empresa: "Empresa A", fechaInicio: "01/01/2023", fechaFin: "01/01/2024" },
    { id: 2, empresa: "Empresa B", fechaInicio: "02/02/2023", fechaFin: "02/02/2024" },
    { id: 3, empresa: "Empresa C", fechaInicio: "03/03/2023", fechaFin: "03/03/2024" },
];

function VerAseguradorasPopup() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="p-10">
        <button
            onClick={() => setIsOpen(true)}
            className="bg-black text-white px-4 py-2 rounded"
        >
            Ver aseguradoras
        </button>

        <Modal_Recode
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title="Aseguradoras"
        >
            <ListaAseguradoras_Recode aseguradoras={aseguradoras} />
        </Modal_Recode>
        </div>
    );
}

export default VerAseguradorasPopup;