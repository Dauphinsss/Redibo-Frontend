export type Car = {
  marca: string
  modelo: string
  anio: string
  precio_por_dia: number
  imagenes: string
  veces_alquilado: number
}

export type Aeropuerto = {
  nombre: string
  latitud: number
  longitud: number
  ciudad: {
    nombre: string
  }
}