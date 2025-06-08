import { Star } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

type Props = {
  valorInicial?: number;
  onCalificar: (valor: number) => void;
};

export default function EstrellasInteractiva({ valorInicial = 0, onCalificar }: Props) {
  const [valor, setValor] = useState(valorInicial);
  const [hover, setHover] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setValor(valorInicial);
  }, [valorInicial]);

  const handleClick = (index: number) => {
    setValor(index);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onCalificar(index);
    }, 5000);
  };

  return (
    <div className="flex text-black">
      {[...Array(5)].map((_, i) => {
        const index = i + 1;
        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(index)}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(0)}
            className="bg-transparent border-none cursor-pointer"
          >
            <Star
              size={16}
              fill={index <= (hover || valor) ? "currentColor" : "none"}
              className="stroke-current"
            />
          </button>
        );
      })}
    </div>
  );
}
