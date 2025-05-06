"use client";

import React, { memo, useState, useEffect } from "react";

interface Herramienta {
    id: number;
    nombre: string;
    cantidad: number;
}

interface Props {
    onVolver?: () => void;
}

function Herramientas_Recode({ onVolver }: Props) {
    const [nombre, setNombre] = useState("");
    const [cantidad, setCantidad] = useState<number | "">("");
    const [herramientas, setHerramientas] = useState<Herramienta[]>([]);
    const [nextId, setNextId] = useState(1);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [modoEdicion, setModoEdicion] = useState(false);

    useEffect(() => {
        const almacenadas = localStorage.getItem("herramientas_recode");
        if (almacenadas) {
            const parseadas: Herramienta[] = JSON.parse(almacenadas);
            setHerramientas(parseadas);
            const maxId = parseadas.reduce((max, h) => Math.max(max, h.id), 0);
            setNextId(maxId + 1);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("herramientas_recode", JSON.stringify(herramientas));
    }, [herramientas]);

    const handleGuardar = () => {
        if (nombre.trim() === "" || cantidad === "" || cantidad < 1) return;

        if (modoEdicion && selectedId !== null) {
            // Actualizar existente
            setHerramientas((prev) =>
                prev.map((h) =>
                h.id === selectedId ? { ...h, nombre, cantidad: Number(cantidad) } : h
                )
            );
        } else {
            // Agregar nuevo
            const nueva: Herramienta = {
                id: nextId,
                nombre,
                cantidad: Number(cantidad),
            };
            setHerramientas((prev) => [...prev, nueva]);
            setNextId(nextId + 1);
        }

        limpiarFormulario();
    };

    const handleEditar = () => {
        if (selectedId !== null) {
            const h = herramientas.find((item) => item.id === selectedId);
            if (h) {
                setNombre(h.nombre);
                setCantidad(h.cantidad);
                setModoEdicion(true);
            }
        }
    };

    const handleBorrar = () => {
        if (selectedId !== null) {
            setHerramientas((prev) => prev.filter((h) => h.id !== selectedId));
            limpiarFormulario();
        }
    };

    const limpiarFormulario = () => {
        setNombre("");
        setCantidad("");
        setSelectedId(null);
        setModoEdicion(false);
    };

    const handleSeleccion = (id: number) => {
        setSelectedId(id);
        setModoEdicion(false);
    };

    return (
        <div className="p-4">
            <button
                onClick={onVolver}
                className="bg-black text-white px-4 py-1 rounded mb-4"
            >
                Volver
            </button>

            <h2 className="text-lg font-bold mb-4">Herramientas del Vehículo</h2>

            <div className="grid grid-cols-4 gap-4 items-center mb-4">
                <label htmlFor="nombre" className="col-span-1 text-right">
                    Nombre:
                </label>
                <input
                    id="nombre"
                    type="text"
                    placeholder="Ej: Gato hidráulico"
                    className="col-span-3 border rounded px-2 py-1"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    disabled={!modoEdicion && selectedId !== null}
                />

                <label htmlFor="cantidad" className="col-span-1 text-right">
                    Cantidad:
                </label>
                <input
                    id="cantidad"
                    type="number"
                    min={1}
                    placeholder="Ej: 1"
                    className="col-span-3 border rounded px-2 py-1 w-32"
                    value={cantidad}
                    onChange={(e) => setCantidad(Number(e.target.value))}
                    disabled={!modoEdicion && selectedId !== null}
                />
            </div>

            <div className="flex justify-end gap-2 mb-4">
                <button
                    className="bg-black text-white px-4 py-1 rounded"
                    onClick={handleBorrar}
                    disabled={selectedId === null}
                >
                    Borrar
                </button>
                <button
                    className="bg-black text-white px-4 py-1 rounded"
                    onClick={handleEditar}
                    disabled={selectedId === null}
                >
                    Editar
                </button>
                <button
                    className="bg-black text-white px-4 py-1 rounded"
                    onClick={handleGuardar}
                >
                    Guardar
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border border-black rounded">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                        <th className="border border-black px-2 py-1 w-16">Id</th>
                        <th className="border border-black px-2 py-1">Nombre</th>
                        <th className="border border-black px-2 py-1 w-32">Cantidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        {herramientas.map((h) => (
                        <tr
                            key={h.id}
                            onClick={() => handleSeleccion(h.id)}
                            className={
                            selectedId === h.id ? "bg-gray-200 cursor-pointer" : "cursor-pointer"
                            }
                        >
                            <td className="border border-black px-2 py-1">{h.id}</td>
                            <td className="border border-black px-2 py-1">{h.nombre}</td>
                            <td className="border border-black px-2 py-1">{h.cantidad}</td>
                        </tr>
                        ))}
                        {herramientas.length === 0 && (
                        <tr>
                            <td
                            colSpan={3}
                            className="text-center text-gray-500 py-2 border border-black"
                            >
                            No hay herramientas registradas.
                            </td>
                        </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default memo(Herramientas_Recode);
