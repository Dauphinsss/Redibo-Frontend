interface Props {
    imagenUrl: string;
}
export default function CarCardImg({ imagenUrl }: Props) {
    return (
        <div className="w-[140px] h-[140px] min-w-[140px] bg-gray-200 rounded-xl shadow flex items-center justify-center overflow-hidden">
        {imagenUrl ? (
            <img src={imagenUrl} alt="Auto" className="w-full h-full object-cover" />
        ) : (
            <span className="text-4xl text-gray-400">🚗</span>
        )}
        </div>
    );
}