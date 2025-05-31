import { memo } from "react";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { useExpandingCard } from "@/app/busqueda/hooks/useExpandingCard";
import {
  FaSnowflake,
  FaMusic,
  FaMapMarkedAlt,
  FaLock,
  FaCarSide,
  FaMotorcycle,
  FaSatelliteDish,
  FaSolarPanel,
} from "react-icons/fa";
import "./CaracAdicionales.css";

interface Props {
  presentes: string[];
  faltantes: string[];
}

// Solo mostramos el ícono de aire acondicionado
const iconoAireAcondicionado = <FaSnowflake />;

function CarCardFeatures({ presentes, faltantes }: Props) {
  const { isExpanded, toggleExpand } = useExpandingCard();

  console.log("Características presentes en verde:", presentes);

  return (
    <div className={`car-card-features ${isExpanded ? "expanded" : ""}`}>
      <button
        className="flex items-center gap-2 text-black hover:text-black transition-all duration-300"
        onClick={toggleExpand}
      >
        <span className="font-bold">Características Adicionales</span>
        {isExpanded ? <MdExpandLess size={20} /> : <MdExpandMore size={20} />}
      </button>

      {isExpanded && (presentes.length > 0 || faltantes.length > 0) && (
        <ul className="features-list bg-white visible grid-container">
          {presentes.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              {/* Solo agregamos el icono si la característica es "Aire acondicionado" */}
              {feature === "Aire acondicionado" && iconoAireAcondicionado}{" "}
              <span style={{ color: "green", fontWeight: "bold" }}>
                {feature}
              </span>
            </li>
          ))}
          {faltantes.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              {feature === "Aire acondicionado" && iconoAireAcondicionado}{" "}
              <span style={{ color: "red", opacity: "0.7" }}>{feature}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default memo(CarCardFeatures);
