interface Props {
    onClick: () => void
}
export default function RecodeLoadMoreButton({ onClick }: Props) {
    return (
        <button
            onClick={onClick}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition">
                Ver más resultados
        </button>
    )
}