export interface CarCardProps {
    idAuto: number;
    modelo: string;
    marca: string;
    asientos: number;
    puertas: number;
    transmision: string;
    combustibles: string[];
    host: string;
    ubicacion: string;
    src?: string | null;
    alt: string;
    onVerAseguradoras?: (idAuto: number) => void;
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
    src?: string | null;
    alt: string;
}