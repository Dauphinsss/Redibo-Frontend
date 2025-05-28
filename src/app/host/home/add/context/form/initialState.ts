// src/contexts/form/initialState.ts
import { FormData } from './types';

export const initialFormData: FormData = {
  direccion: { 
    id_provincia: null, 
    ciudadId: null, 
    calle: "", 
    zona: "", 
    num_casa: "", 
    latitud: 0,
    longitud: 0
  },
  datosPrincipales: { 
    vim: "", 
    año: 0, 
    marca: "", 
    modelo: "", 
    placa: "" 
  },
  caracteristicas: { 
    combustibleIds: [], 
    asientos: 0, 
    puertas: 0, 
    transmicion: "Automatica", 
    soat: false
  },
  caracteristicasAdicionales: { 
    extraIds: [] 
  },
  finalizacion: { 
    imagenes: [], 
    num_mantenimientos: 0, 
    precio_por_dia: 0, 
    estado: "Disponible", 
    descripcion: "" 
  }
};