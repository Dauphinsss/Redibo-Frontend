interface Props {
    nombre: string;
    marca: string;
}

export default function CarCardHeader({ nombre, marca }: Props) {
    return (
        <div className="mb-2">
        <h2 className="text-lg font-bold">{nombre}</h2>
        <p className="text-sm text-gray-500">{marca}</p>
        </div>
    );
}
