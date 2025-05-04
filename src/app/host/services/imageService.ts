// src/app/host/services/imageService.ts

import axios from 'axios';

const API_URL = "http://localhost:4000/api/v2/images";

export interface Image {
  id: number;
  data: string;      // URL de la imagen
  public_id: string; // ID interno de Cloudinary
  width?: number;
  height?: number;
  format?: string;
}

export interface GetImagesResponse {
  success: boolean;
  data: Image[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

/**
 * 1. Obtener todas las imágenes de un carro (con paginación opcional)
 */
export async function getImagesByCarId(
  carId: number,
  page = 1,
  pageSize = 20
): Promise<GetImagesResponse> {
  const resp = await axios.get<GetImagesResponse>(`${API_URL}/${carId}`, {
    params: { page, pageSize },
  });
  return resp.data;
}

/**
 * 2. Subir una nueva imagen para un carro
 */
export async function uploadImage(
  carId: number,
  file: File
): Promise<Image> {
  const form = new FormData();
  form.append('file', file);

  const resp = await axios.post<{ success: boolean; image: Image }>(
    `${API_URL}/${carId}`,
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return resp.data.image;
}

/**
 * 3. Reemplazar una imagen existente
 */
export async function updateImage(
  imageId: number,
  file: File
): Promise<Image> {
  const form = new FormData();
  form.append('file', file);

  const resp = await axios.put<{ success: boolean; image: Image }>(
    `${API_URL}/${imageId}`,
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return resp.data.image;
}

/**
 * 4. Eliminar una imagen
 */
export async function deleteImage(imageId: number): Promise<void> {
  await axios.delete(`${API_URL}/${imageId}`);
}
