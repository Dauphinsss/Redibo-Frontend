export interface SolicitudRecodePost {
  fecha: string;
  hostNombre: string;
  renterNombre: string;
  modelo: string;
  marca: string;
  precio: string;
  fechaRecogida: string;
  fechaDevolucion: string;
  lugarRecogida: string;
  lugarDevolucion: string;
  renterEmail: string;
  hostEmail: string;
  id_renter: number;
  id_host: number;
}