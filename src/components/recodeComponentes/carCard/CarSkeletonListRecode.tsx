export default function AutoSkeletonList() {
    return (
        <div className="flex flex-col gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
            <div
            key={i}
            className="w-full max-w-[750px] md:h-[320px] border border-black rounded-[15px] p-6 shadow-sm bg-white flex flex-col md:flex-row gap-4 animate-pulse"
            >
            {/* Imagen */}
            <div className="w-full md:w-[230px] h-[150px] md:h-full bg-gray-300 rounded-[10px]" />

            {/* Contenido */}
            <div className="flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                <div className="h-5 bg-gray-300 rounded w-1/3" /> {/* Título */}
                <div className="h-4 bg-gray-300 rounded w-2/3" /> {/* Specs */}
                <div className="h-4 bg-gray-300 rounded w-1/2" /> {/* Host */}
                <div className="h-4 bg-gray-300 rounded w-1/2" /> {/* Ubicación */}
                </div>
            </div>

            {/* Precio */}
            <div className="w-[120px] h-[60px] bg-gray-300 rounded-lg self-end md:self-auto" />
            </div>
        ))}
        </div>
    );
}  