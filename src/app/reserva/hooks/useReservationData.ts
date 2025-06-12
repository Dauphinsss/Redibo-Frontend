"use client";

import { useState, useEffect } from "react";
import { getCarById, getUsuarioById, getHostByCarId } from "@/app/reserva/services/services_reserva";
import { API_URL } from "@/utils/bakend";

import { UsuarioInterfazRecode } from "@/app/reserva/interface/Ususario_Interfaz_Recode";
import { Conductor } from "@/app/reserva/components/SeleccionarConductores_7-bits";

// Este hook encapsula toda la lógica para obtener 
// los datos necesarios para una reserva.
export function useReservationData(id_carro: number) {
    const [datosRenter, setDatosRenter] = useState<UsuarioInterfazRecode | null>(null);
    const [datosHost, setDatosHost] = useState<UsuarioInterfazRecode | null>(null);
    const [datosAuto, setDatosAuto] = useState<{ modelo: string; marca: string; precio: number } | null>(null);
    const [conductores, setConductores] = useState<Conductor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id_carro) {
            setIsLoading(false);
            setError("ID de vehículo no proporcionado.");
            return;
        }

        const cargarDatosIniciales = async () => {
            setIsLoading(true);
            setError(null);
            
            const token = localStorage.getItem("auth_token");
            if (!token) {
                try {
                    const [autoData, hostData] = await Promise.all([
                        getCarById(id_carro.toString()),
                        getHostByCarId(id_carro)
                    ]);

                    if (!autoData) throw new Error("No se encontró el vehículo.");
                    setDatosAuto({ modelo: autoData.modelo, marca: autoData.marca, precio: autoData.precio });

                    if (!hostData) throw new Error("No se pudo obtener la información del propietario.");
                    setDatosHost(hostData);
                    
                } catch (err) {
                    setError(err instanceof Error ? err.message : "Error al cargar datos.");
                } finally {
                    setIsLoading(false);
                }
                return;
            }
            
            try {
                const perfilPromise = fetch(`${API_URL}/api/perfil`, { headers: { Authorization: `Bearer ${token}` } });
                const autoPromise = getCarById(id_carro.toString());
                const hostPromise = getHostByCarId(id_carro);
                const conductoresPromise = fetch(`${API_URL}/api/conductores-asociados`, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } });
                
                const [perfilResponse, autoData, hostData, conductoresResponse] = await Promise.all([
                    perfilPromise, autoPromise, hostPromise, conductoresPromise
                ]);

                // Renter
                if (!perfilResponse.ok) throw new Error("No se pudo verificar la sesión");
                const perfilData = await perfilResponse.json();
                const renterDetails = await getUsuarioById(perfilData.id);
                if (!renterDetails) throw new Error("No se pudo cargar tu perfil");
                setDatosRenter(renterDetails);

                // Auto
                if (!autoData) throw new Error("No se encontró el vehículo.");
                setDatosAuto({ modelo: autoData.modelo, marca: autoData.marca, precio: autoData.precio });
                
                // Host
                if (!hostData) throw new Error("No se pudo obtener la información del propietario.");
                setDatosHost(hostData);

                // Conductores
                if (!conductoresResponse.ok) throw new Error("No se pudo obtener la lista de conductores");
                const dataConductores = await conductoresResponse.json();
                setConductores(dataConductores.conductores || []);

            } catch (err) {
                setError(err instanceof Error ? err.message : "Error al cargar datos de la reserva");
            } finally {
                setIsLoading(false);
            }
        };
        cargarDatosIniciales();
    }, [id_carro]);

    return { datosRenter, datosHost, datosAuto, conductores, isLoading, error };
}