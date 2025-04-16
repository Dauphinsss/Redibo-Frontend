import api from "@/api/api";
import api2 from '@/api/api2';

export const getAllCars = async () => {
  try {
    const response = await api.get("/autos");
    return response.data;
  } catch (error) {
    console.error("Error al obtener los autos:", error);
    throw error;
  }
};

/*export async function getCarById(id: string) {
  const res = await fetch(`https://search-car-backend.vercel.app/detailCar/${id}`);
  if (!res.ok) throw new Error('No se pudo obtener el auto');
  return await res.json();
}*/

export const getCarById = async (id: string) => {
  try {
    const response = await api2.get(`/detailCar/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el auto con ID ${id}:`, error);
    throw error;
  }
};

export const getCarsByModelDesc = async () => {
  try {
    const response = await api.get("/filterCar", {
      params: {
        ordenar: "modelo_desc",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al filtrar autos por modelo descendente:", error);
    throw error;
  }
};

export const getCarsByModelAsc = async () => {
  try {
    const response = await api.get("/filterCar", {
      params: {
        ordenar: "modelo_asc",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al filtrar autos por modelo ascendente:", error);
    throw error;
  }
};

export const getCarsByPriceAsc = async () => {
  try {
    const response = await api.get("/filterCar", {
      params: {
        ordenar: "precio_asc",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al filtrar autos por precio ascendente:", error);
    throw error;
  }
};

export const getCarsByPriceDesc = async () => {
  try {
    const response = await api.get("/filterCar", {
      params: {
        ordenar: "precio_desc",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al filtrar autos por precio descendente:", error);
    throw error;
  }
};
