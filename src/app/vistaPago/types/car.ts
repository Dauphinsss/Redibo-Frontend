export interface Vehiculo {
  modelo: string | undefined;
  marca: string | undefined;
  precio_por_dia: number | undefined;
  imagen: string | '';
  direccion: string | undefined;
}
export interface Host {
  id_host: string;
}
export interface PaymentOrderPayload {
  id_carro: number;
  id_usuario_host: number;
  id_usuario_renter: number;
  monto_a_pagar: number;
}