import { Star } from 'lucide-react';
import React, { useEffect, useState } from 'react'

type Props ={
    valorInicial?:  number;
    onCalificar:(valor:number)=>void;
}

export default function EstrellasInteractiva({valorInicial = 0, onCalificar}: Props) {
    const [valor, setValor] = useState(valorInicial);
    const [hover, setHover] = useState(0);

    useEffect(()=>{
        setValor(valorInicial);
    }, [valorInicial])
  return (
     <div className="flex text-black">
      {[...Array(5)].map((_, i) => {
        const index = i + 1;
        return (
          <button
            key={index}
            type="button"
            onClick={() => {
              setValor(index);
              onCalificar(index);
            }}
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
