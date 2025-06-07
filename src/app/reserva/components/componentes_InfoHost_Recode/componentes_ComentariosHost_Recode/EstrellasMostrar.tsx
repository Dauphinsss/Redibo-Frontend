import { Star } from "lucide-react";

type Props = {
  valor: number; // de 1 a 5
};

const EstrellasMostrar = ({ valor }: Props) => (
    <div className="flex text-black">
        {[...Array(5)].map((_, i) => (
        <Star
            key={i}
            size={16}
            fill={i < valor ? "currentColor" : "none"}
            className="stroke-current"
        />
        ))}
    </div>
);

export default EstrellasMostrar;
