"use client";

import { useState } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";

const vehiculos = [
  "Mercedez",
  "Chervrolet",
  "Apollo",
  "Audi",
  "Alpina",
  "Ferrari",
  "Bugatti",
  "Bitter",
  "BMW",
  "Brabus",
  "Mustang",
  "Muelle",
  "Muerdago",
  "Muerto",
  "Musico",
  "Muslo",
  "Mundial",
  "Musica",
  "Ford"
];

interface SearchBarProps {
  name: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ name }) => {
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState<string[]>([]);
  const [historial, setHistorial] = useState<string[]>([]);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);

  const handleBusqueda = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setBusqueda(valor);

    if (valor.length >= 1) {
      const filtrados = vehiculos.filter((vehiculo) =>
        vehiculo.toLowerCase().includes(valor.toLowerCase())
      );
      setResultados(filtrados);
      setMostrarHistorial(false);
    } else {
      setResultados([]);
      setMostrarHistorial(false);
    }
  };

  const handleFocus = () => {
    if (busqueda.length === 0) {
      setMostrarHistorial(true);
    }
  };

  const handleSelectItem = (item: string) => {
    setBusqueda(item);
    setResultados([]);
    setMostrarHistorial(false);
    setHistorial((prev) => (prev.includes(item) ? prev : [...prev, item]));
  };

  const handleDeleteItem = (item: string) => {
    setHistorial((prev) => prev.filter((i) => i !== item));
  };

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        placeholder={name}
        value={busqueda}
        onChange={handleBusqueda}
        onFocus={handleFocus}
        onBlur={() => {
          setTimeout(() => {
            setMostrarHistorial(false);
            setResultados([]);
          }, 150);
        }}
        className="p-2 border border-gray-300 rounded-md w-full h-12 text-left pr-12 text-[11px] md:text-base lg:text-lg "//focus:outline-none focus:ring-0 shadow-none
      />
      <button className="absolute right-1 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black text-white rounded-md flex items-center justify-center">
        <MagnifyingGlassIcon className="h-5 w-5" />
      </button>

      {(resultados.length > 0 || mostrarHistorial) && (
        <ul className="absolute z-10 w-full bg-white border mt-1 rounded-md shadow-md max-h-60 overflow-y-auto">
          {resultados.length > 0
            ? resultados.map((item, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => handleSelectItem(item)}
                >
                  {item}
                </li>
              ))
            : historial.map((item, index) => (
                <li
                  key={index}
                  className="px-4 py-2 flex justify-between items-center hover:bg-gray-100 text-sm text-gray-500"
                >
                  <span
                    className="cursor-pointer"
                    onClick={() => handleSelectItem(item)}
                  >
                    {item}
                  </span>
                  <button
                    className="ml-2 text-gray-400 "//hover:text-red-500
                    onClick={() => handleDeleteItem(item)}
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </li>
              ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
