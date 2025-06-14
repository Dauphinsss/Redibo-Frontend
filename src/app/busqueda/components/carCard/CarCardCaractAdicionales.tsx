import { memo } from "react";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { useExpandingCard } from "@/app/busqueda/hooks/useExpandingCard";
import { FaBluetooth, FaMobileScreenButton } from "react-icons/fa6";
import { GiGps, GiCarSeat } from "react-icons/gi";
import "./CaracAdicionales.css";
import { TbAirConditioning, TbCarGarage } from "react-icons/tb";
import { MdPedalBike, MdOutlineSecurity, MdWindow } from "react-icons/md";
import { FaSkiing } from "react-icons/fa";
import { RiArmchairLine } from "react-icons/ri";
import { TiCamera } from "react-icons/ti";
import { BsFillSpeakerFill } from "react-icons/bs";

interface Props {
  presentes: string[];
}

// Lista de todas las características posibles
const todasLasCaracteristicas = [
  "Aire acondicionado",
  "Bluetooth",
  "GPS",
  "Portabicicletas",
  "Soporte para esquís",
  "Pantalla táctil",
  "Sillas para bebé",
  "Cámara de reversa",
  "Asientos de cuero",
  "Sistema antirrobo",
  "Toldo o rack de techo",
  "Vidrios polarizados",
  "Sistema de sonido",
];

// Mapeo de íconos para cada característica
const iconosCaracteristicas: Record<string, JSX.Element> = {
  "Aire acondicionado": <TbAirConditioning />,
  Bluetooth: <FaBluetooth />,
  GPS: <GiGps />,
  Portabicicletas: <MdPedalBike />,
  "Soporte para esquís": <FaSkiing />,
  "Pantalla táctil": <FaMobileScreenButton />,
  "Sillas para bebé": <RiArmchairLine />,
  "Cámara de reversa": <TiCamera />,
  "Asientos de cuero": <GiCarSeat />,
  "Sistema antirrobo": <MdOutlineSecurity />,
  "Toldo o rack de techo": <TbCarGarage />,
  "Vidrios polarizados": <MdWindow />,
  "Sistema de sonido": <BsFillSpeakerFill />,
};

function CarCardCaractAdicionales({ presentes }: Props) {
  const { isExpanded, toggleExpand } = useExpandingCard();

  return (
    <div className={`car-card-features ${isExpanded ? "expanded" : ""}`}>
      <button
        className="flex items-center gap-2 text-black hover:text-black transition-all duration-300"
        onClick={toggleExpand}
      >
        <span className="font-bold">Características Adicionales</span>
        {isExpanded ? <MdExpandLess size={20} /> : <MdExpandMore size={20} />}
      </button>

      {isExpanded && (
        <ul className="features-list bg-white visible grid-container">
          {todasLasCaracteristicas.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <span
                style={{ color: presentes.includes(feature) ? "green" : "red" }}
              >
                {iconosCaracteristicas[feature] ? (
                  <span
                    style={{
                      color: presentes.includes(feature) ? "green" : "red",
                      display: "inline-flex",
                      alignItems: "center",
                      marginRight: "5px",
                    }}
                  >
                    {iconosCaracteristicas[feature]}
                  </span>
                ) : (
                  "❓"
                )}
                {feature}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default memo(CarCardCaractAdicionales);
