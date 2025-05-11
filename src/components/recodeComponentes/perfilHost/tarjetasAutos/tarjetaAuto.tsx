import RecodeAutoimag from "../../detailsCar/RecodeAutoimag";

interface Props{
    fotoAuto: { id: number; data: string }[];
    modeloAuto: string;
    marcaAuto: string;
}

function TarjetaCar({fotoAuto,modeloAuto,marcaAuto}:Props){
    return(
        <div>
            <div>
            <RecodeAutoimag imagenes={fotoAuto} nombre={""} ></RecodeAutoimag>
            </div>

            <div>
                <h2>Modelo: {modeloAuto}</h2>
                <h2>Marca: {marcaAuto}</h2>
            </div>
        </div>
    );
}
export default TarjetaCar