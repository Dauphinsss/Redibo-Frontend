export interface ImagenAuto {
    id: number;
    data: string;
  }
  
  export interface AutoImagProps {
    imagenes: ImagenAuto[];
    nombre: string;
  }
  
  export interface DescriHostProps {
    nombreHost: string;
    calificacion: number;
    numAuto: number;
  }
  
  export interface DescripcionAutoProps {
    descripcion: string;
  }
  
  export interface InfoDestacableProps {
    marca: string;
    modelo: string;
    placa: string;
    combustible: string[];
  }
  
  export interface InfoPrincipalProps {
    asientos: number;
    puertas: number;
    transmision: string;
    combustible: string[];
    calificacion: number;
    direccion: string;
  }
  
  export interface ReservaProps {
    precio: string;
  }
  
  export interface UbicacionProps {
    direccion: string;
  }
  