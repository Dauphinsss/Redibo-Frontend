export type Car = {
  id: number
  marca: string
  modelo: string
  anio: string
  precio_por_dia: number
  imagenes: string
  veces_alquilado: number
  latitud: number
  longitud: number
  puertas: number
  asientos: number
  calificacion: number
  transmision: string
}

export type Aeropuerto = {
  nombre: string
  latitud: number
  longitud: number
  ciudad: {
    nombre: string
  }
}