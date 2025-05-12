import RecodeAutoimag from "../../detailsCar/RecodeAutoimag";

interface Props{
    fotoAuto: { id: number; data: string }[];
    modeloAuto: string;
    marcaAuto: string;
}

function TarjetaCar({fotoAuto,modeloAuto,marcaAuto}:Props){
    return(
        <div className="border rounded-lg p-4 flex flex-row items-center shadow-md">
            <div className="w-20 h-20 bg-gray-300 rounded mb-2 flex items-center justify-center">
            <RecodeAutoimag imagenes={fotoAuto} nombre={""} ></RecodeAutoimag>
            </div>

            <div className="text-sm">
                <h2>Modelo: {modeloAuto}</h2>
                <h2>Marca: {marcaAuto}</h2>
            </div>
        </div>
    );
}
export default TarjetaCar