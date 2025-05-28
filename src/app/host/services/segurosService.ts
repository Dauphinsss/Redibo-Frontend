import axios, { AxiosInstance } from 'axios';

// Configuración base
const API: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v2/seguros",
  timeout: 10000,
});

// Interfaces
export interface Seguro {
  id: number;
  empresa: string;
  nombre: string;
  tipoSeguro: string;
}

export interface SeguroCarro {
  id: number;
  id_carro: number;
  id_seguro: number;
  fechaInicio: string;
  fechaFin: string;
  enlace?: string;
}

export interface SeguroAdicionalPayload {
  id_seguro: number;
  fechaInicio: string;
  fechaFin: string;
  enlace?: string;
}

// Clase principal del servicio
class SegurosService {
  // Métodos para tipos de seguro (CRUD)
  async getSeguros(): Promise<Seguro[]> {
    try {
      const response = await API.get(`/seguros`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async getSeguroById(id: number): Promise<Seguro> {
    try {
      const response = await API.get(`/seguros/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async createSeguro(seguro: Omit<Seguro, 'id'>): Promise<Seguro> {
    try {
      const response = await API.post(`/seguros`, seguro);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async updateSeguro(id: number, seguro: Partial<Omit<Seguro, 'id'>>): Promise<Seguro> {
    try {
      const response = await API.put(`/seguros/${id}`, seguro);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async deleteSeguro(id: number): Promise<void> {
    try {
      await API.delete(`/seguros/${id}`);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Métodos para pólizas de seguro de coche
  async createSeguroCarro(idCarro: number, seguro: SeguroAdicionalPayload): Promise<SeguroCarro> {
    try {
      const response = await API.post(`/carros/${idCarro}/seguros`, seguro);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async createSegurosCarroBatch(idCarro: number, seguros: SeguroAdicionalPayload[]): Promise<{ success: boolean; count: number }> {
    try {
      if (seguros.length === 0) {
        throw new Error('El array de seguros no puede estar vacío');
      }

      const response = await API.post(`/carros/${idCarro}/seguros/batch`, seguros);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async getSeguroCarroById(id: number): Promise<SeguroCarro> {
    try {
      const response = await API.get(`/carros/seguros/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async updateSeguroCarro(id: number, seguro: Partial<Omit<SeguroCarro, 'id' | 'id_carro'>>): Promise<SeguroCarro> {
    try {
      const response = await API.put(`/carros/seguros/${id}`, seguro);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async deleteSeguroCarro(id_carro: number): Promise<void> {
    try {
      await API.delete(`/api/carros/${id_carro}/seguros`);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Método auxiliar para manejo de errores
  private handleError(error: unknown): void {
    if (axios.isAxiosError(error)) {
      const status: number | undefined = error.response?.status;
      const message: string = error.response?.data?.message || 'Error desconocido';

      switch (status) {
        case 400:
          console.error('Error de validación:', message);
          break;
        case 404:
          console.error('Recurso no encontrado:', message);
          break;
        case 500:
          console.error('Error del servidor:', message);
          break;
        default:
          console.error('Error en la operación:', message);
      }
    } else {
      console.error('Error no controlado:', error);
    }
  }
}

// Exportamos una instancia única del servicio
export const segurosService = new SegurosService();
