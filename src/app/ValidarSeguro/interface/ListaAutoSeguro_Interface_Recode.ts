export interface CarCardProps {
    modelo: string;
    marca: string;
    asientos: number;
    puertas: number;
    transmision: string;
    combustibles: string[];
    host: string;
    ubicacion: string;
    src: string;
    alt: string;
}

export interface CarDetailsProps {
    modelo: string;
    marca: string;
    asientos: number;
    puertas: number;
    transmision: string;
    combustibles: string[];
    host: string;
    ubicacion: string;
}

export interface CarImageProps {
    src: string;
    alt: string;
}