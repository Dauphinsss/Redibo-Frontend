"use client";

import { useState, useEffect } from "react";
import { getCarById, getUsuarioById, getHostByCarId } from "@/app/reserva/services/services_reserva";
import { UsuarioInterfazRecode } from "@/app/reserva/interface/Ususario_Interfaz_Recode";
import { API_URL } from "@/utils/bakend";

export function useReservationData(id_carro: number) {
    const [datosRenter, setDatosRenter] = useState<UsuarioInterfazRecode | null>(null);
    const [datosHost, setDatosHost] = useState<UsuarioInterfazRecode | null>(null);
    const [datosAuto, setDatosAuto] = useState<{ modelo: string; marca: string; precio_por_dia: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id_carro) {
            setLoading(false);
            setError("ID de carro no válido.");
            return;
        }

        const cargarDatosIniciales = async () => {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem("auth_token");
        if (!token) {
            setError("Por favor, inicie sesión para continuar.");
            setLoading(false);
            return;
        }

        try {
            // Obtenemos todos los datos en paralelo cuando sea posible
            const perfilPromise = fetch(`${API_URL}/api/perfil`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const autoPromise = getCarById(id_carro.toString());
            const hostPromise = getHostByCarId(id_carro);

            const [perfilResponse, autoData, hostData] = await Promise.all([
                perfilPromise,
                autoPromise,
                hostPromise
            ]);

            // Procesar datos del Renter
            if (!perfilResponse.ok) throw new Error("No se pudo verificar la sesión del usuario.");
            const perfilData = await perfilResponse.json();
            const renterDetails = await getUsuarioById(perfilData.id);
            if (!renterDetails) throw new Error("No se pudieron cargar los detalles del arrendatario.");
            setDatosRenter(renterDetails);

            // Procesar datos del Auto
            if (!autoData) throw new Error("No se encontró el vehículo.");
            setDatosAuto({
                modelo: autoData.modelo,
                marca: autoData.marca,
                precio_por_dia: autoData.precio,
            });

            // Procesar datos del Host
            if (!hostData) throw new Error("No se pudo obtener la información del propietario para este vehículo.");
            setDatosHost(hostData);

        } catch (error) {
            console.error("Error al cargar datos:", error);
            setError(error instanceof Error ? error.message : "Error al cargar la información necesaria.");
        } finally {
            setLoading(false);
        }
        };
        
        cargarDatosIniciales();
    }, [id_carro]);

    return { datosRenter, datosHost, datosAuto, loading, error };
}