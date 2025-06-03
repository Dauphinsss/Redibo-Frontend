import { CoberturaInterface } from "@/app/validarSeguro/interface/CoberturaForm_Interface_Recode";
import axios from "axios";


const API_BASE = "/api/seguros";

export const useCoberturaAPI = () => {
  const agregarCobertura = async (id_seguro: number, cobertura: CoberturaInterface) => {
    const { data } = await axios.post(`${API_BASE}/${id_seguro}/coberturas`, cobertura);
    return data;
  };

  const actualizarCobertura = async (id_cobertura: number, cobertura: CoberturaInterface) => {
    const { data } = await axios.put(`${API_BASE}/coberturas/${id_cobertura}`, cobertura);
    return data;
  };

  const eliminarCobertura = async (id_cobertura: number) => {
    await axios.delete(`${API_BASE}/coberturas/${id_cobertura}`);
  };

  const obtenerCoberturas = async (id_seguro: number) => {
    const { data } = await axios.get(`${API_BASE}/${id_seguro}/coberturas`);
    return data as CoberturaInterface[];
  };

  return {
    agregarCobertura,
    actualizarCobertura,
    eliminarCobertura,
    obtenerCoberturas,
  };
};
