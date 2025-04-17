import { MdPlace } from "react-icons/md";

interface RecodeUbicacionProps {
    direccion: string;
}

const RecodeUbicacion = ({ direccion }: RecodeUbicacionProps) => {
    return (
        <div className="w-full border-t border-gray-300 p-4">
            <h4 className="font-semibold mb-2 text-base sm:text-lg">Ubicación</h4>
            <div className="border border-gray-400 p-4 rounded-md flex justify-center items-center">
                <MdPlace className="text-gray-500 w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <p className="mt-2 text-sm text-gray-600 text-center">
                {direccion}
            </p>
        </div>
    );
};

RecodeUbicacion.displayName = "RecodeUbicacion";

export default RecodeUbicacion;