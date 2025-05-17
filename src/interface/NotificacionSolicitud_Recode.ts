export interface Solicitud {
fecha: string;
hostNombre: string;
renterNombre: string;
modelo: string;
marca: string;
precio: number;
fechaRecogida: string;
fechaDevolucion: string;
lugarRecogida: string;
lugarDevolucion: string;
renterEmail: string;
hostEmail: string;
id_renter: number;
id_host: number;
}

export interface Notificacion {
  id: string;
  tipo: 'host' | 'renter';
  mensaje: string;
  fecha: string;
  datos: {
    nombreUsuario?: string;
    nombreHost?: string;
    marcaVehiculo: string;
    modeloVehiculo: string;
    fechaInicio: string;
    fechaFin: string;
    lugarRecogida?: string;
    lugarDevolucion?: string;
  };
  estado?: string;
}