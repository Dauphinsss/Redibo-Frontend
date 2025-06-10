"use client";

import { useState, useEffect, useRef } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
//Importacion para el basurerito
import { TrashIcon } from "@heroicons/react/24/solid";

interface SearchBarProps {
  placeholder: string;
  onFiltrar: (query: string) => void;
  obtenerSugerencia: (query: string) => string;
  //NUEVO: Boton de limpiar busqueda
  onClearBusqueda?: () => void;
}
// Añadi onClearBusqueda como propiedad opcional
const SearchBar: React.FC<SearchBarProps> = ({ placeholder, onFiltrar, obtenerSugerencia, onClearBusqueda }) => {
  const [busqueda, setBusqueda] = useState("");
  const [mostrarBoton, setMostrarBoton] = useState(true);
  //NUEVO: estado para mostrar el error
  const [error, setError] = useState(""); // ✅ para mensajes de error

  const inputRef = useRef<HTMLInputElement>(null);
  const [sugerencia, setSugerencia] = useState("");

  //Aqui agregamos los atributos y variables necesarias para el historial
  const [historial, setHistorial] = useState<string[]>([]);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  //NUEVO: estado para verificar si está en línea
  const [estaEnLinea, setEstaEnLinea] = useState(true);

  //NUEVO: Escuchar el estado de conexión
  useEffect(() => {
    const actualizarConexion = () => {
      setEstaEnLinea(navigator.onLine);
    };

    window.addEventListener("online", actualizarConexion);
    window.addEventListener("offline", actualizarConexion);

    // Estado inicial
    actualizarConexion();

    return () => {
      window.removeEventListener("online", actualizarConexion);
      window.removeEventListener("offline", actualizarConexion);
    };
  }, []);

  // Mostrar el botón si hay texto
  useEffect(() => {
    setMostrarBoton(busqueda.trim().length === 0);
  }, [busqueda]);

  // Debounce de 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      const valorNormalizado = busqueda
        .trim()
        .replace(/\s+/g, " ")
        .replace(/[^\p{L}\p{N}\s.\-\/]/gu, "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
      onFiltrar(valorNormalizado);
    }, 300);
    return () => clearTimeout(timer);
  }, [busqueda, onFiltrar]);

  useEffect(() => {
    if (!busqueda.trim()) {
      setSugerencia("");
      return;
    }

    sessionStorage.setItem("ultimaBusqueda", busqueda);

    const timer = setTimeout(() => {
      const sugerido = obtenerSugerencia(busqueda);
      if (
        sugerido &&
        sugerido.toLowerCase() !== busqueda.toLowerCase()
      ) {
        setSugerencia(sugerido);
      } else {
        setSugerencia("");
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [busqueda, obtenerSugerencia]);

  // useEffect para guardar el historial en LocalStorage
  useEffect(() => {
    if (historial.length > 0) {
      localStorage.setItem("historialBusqueda", JSON.stringify(historial));
    }
  }, [historial]);

  useEffect(() => {
    const guardado = localStorage.getItem("historialBusqueda");
    if (guardado) setHistorial(JSON.parse(guardado));

    const guardada = sessionStorage.getItem("ultimaBusqueda");
    if (guardada) {
      setBusqueda(guardada);
      onFiltrar(guardada);
    }
  }, [onFiltrar]);

  //Agregado para el historial
  const handleFocus = () => {
    setMostrarHistorial(true);
  };
  //Agregado para el historial
  const handleBlur = () => {
    if (busqueda.trim()) {
      agregarAHistorial(busqueda);
    }
    setTimeout(() => {
      setMostrarHistorial(false);
    }, 150);
  };
  //Agregado para el historial
  const handleDeleteHistorial = (item: string) => {
    setHistorial((prev) => {
      const nuevoHistorial = prev.filter((i) => i !== item);
      if (nuevoHistorial.length === 0) {
        localStorage.removeItem("historialBusqueda");
      }
      return nuevoHistorial;
    });
  };

  //Agregado para el historial
  const handleSelectHistorial = (item: string) => {
    setBusqueda(item);
    onFiltrar(item);
    setMostrarHistorial(false);

    // Reordenar para que suba como más reciente
    setHistorial((prev) => {
      const sinDuplicados = prev.filter((i) => i !== item);
      return [item, ...sinDuplicados].slice(0, 8);
    })
  };
  //Agregado para el historial
  const agregarAHistorial = (valor: string) => {
    if (!valor.trim()) return;
    setHistorial((prev) => {
      const nuevo = valor.trim();
      const sinDuplicados = prev.filter((item) => item !== nuevo);
      return [nuevo, ...sinDuplicados].slice(0, 8); // máximo 10 entradas
    });
  };
  //NUEVO: Borrar todo el historial
  const handleBorrarTodoHistorial = () => {
    setHistorial([]);
    localStorage.removeItem("historialBusqueda");
  };

  // NUEVO: Activar boton lupa
  const ejecutarBusqueda = () => {
  if (busqueda.trim() !== "") {
    agregarAHistorial(busqueda);
    inputRef.current?.blur();
    onFiltrar(busqueda.trim()); // Asegúrate de que el filtro se aplique
  }
};

//NUEVO: Representa el click en la lupa
const ejecutarBusquedaManual = () => {
  const valor = busqueda.trim();
  if (valor === "") return;

  agregarAHistorial(valor);
  setMostrarHistorial(false);
  inputRef.current?.blur();
  onFiltrar(valor);
};

  return (

    //Añadir flex items-center para modificar el contenedor
    //<div className="relative w-full max-w-md">
    <div className="relative w-full max-w-md z-10">
      <input
        type="text"
        placeholder={placeholder}
        aria-label="Campo de búsqueda de autos por modelo, marca"
        value={busqueda}
        //Tamañp máximo de caracteres
        maxLength={100}
        onChange={(e) => {
          const valor = e.target.value;
          // NUEVO: Detectar si contiene una URL común
          const contieneURL = /https?:\/\/|www\./i.test(valor);
          if (contieneURL) {
            setError("No se permiten enlaces o direcciones web.");
            return;
          }
          // NUEVO: Validar conexión a internet
          if (!navigator.onLine) {
            setError("Sin conexión a internet. No se puede realizar la búsqueda.");
            return;
          }

          //NUEVO: Validar longitud
          if (valor.length >= 100) {
            setError("Has alcanzado el límite máximo de 100 caracteres.");
            return;
          }
          if (error && valor.length <= 100) {
            setError(""); // Limpia error cuando vuelve a ser válido
          }

          setBusqueda(e.target.value);

          if (e.target.value.trim() === "") {
            sessionStorage.removeItem("ultimaBusqueda");
          }
        }}
        //onFocus={() => setMostrarBoton(false)}
        //onBlur={() => setMostrarBoton(true)}
        //Se cambio por 
        ref={inputRef}
        onFocus={handleFocus}
        onBlur={handleBlur}

        onPaste={(e) => {
          const textoPegado = e.clipboardData.getData("text");
          if ((busqueda + textoPegado).length > 100) {
            e.preventDefault(); // ❌ Cancela el pegado
            setError("El texto pegado excede el límite de 100 caracteres.");
          }
        }}

        onKeyDown={(e) => {
          if ((e.key === "ArrowRight" || e.key === "Tab") && sugerencia) {
            e.preventDefault();

            const resto = sugerencia.slice(busqueda.length);
            const siguienteEspacio = resto.indexOf(" ");

            let siguienteParte = "";
            if (siguienteEspacio !== -1) {
              siguienteParte = resto.slice(0, siguienteEspacio + 1);
            } else {
              siguienteParte = resto;
            }

            const nuevaBusqueda = busqueda + siguienteParte;
            setBusqueda(nuevaBusqueda);
            setTimeout(() => {
              inputRef.current?.setSelectionRange(nuevaBusqueda.length, nuevaBusqueda.length);
            }, 0);

            if (nuevaBusqueda === sugerencia) {
              setSugerencia("");
            }
          } else if (e.key === "Enter") { //En este else se agrego para que se aniadan con un enter al historial
            ejecutarBusquedaManual(); // ✅ hace lo mismo que dar clic a la lupa
          }
        }}
        className="p-2 border border-gray-300 rounded-md w-full h-12 text-left pr-12 text-[14px] md:text-base lg:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
      />

      {/* Mostrar error si hay */}
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}

      {/* Botón de búsqueda manual */}
      <button
        type="button"
        aria-label="Buscar autos"
        title="Buscar" // ✅ tooltip nativa
        className="absolute right-1 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black text-white rounded-md flex items-center justify-center hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
        // onClick={() => {
        //   // Ejecutar búsqueda manual si se desea
        //   if (busqueda.trim() !== "") {
        //     agregarAHistorial(busqueda);
        //     inputRef.current?.blur();
        //   }
        // }}
        //Simplificado en esto
        onClick={ejecutarBusquedaManual}
        //NUEVO:Desactiva el boton
        disabled={busqueda.trim() === ""} // 👉 aquí deshabilitas la lupa si está vacío
      >
        <MagnifyingGlassIcon className="h-5 w-5" />
      </button>

      {!mostrarBoton && (
        <button
          type="button"
          aria-label="Limpiar búsqueda"
          title="Limpiar búsqueda" // ✅ tooltip nativa
          onClick={() => {
            setBusqueda("");
            setSugerencia("");
            sessionStorage.removeItem("ultimaBusqueda");
            if (onClearBusqueda) onClearBusqueda(); // <-- NUEVO
          }}
          className="absolute right-12 top-1/2 transform -translate-y-1/2 w-10 h-10 text-gray-500 hover:text-black"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      )}


      {sugerencia && (
        <div
          className="absolute top-0 left-0 p-2 pr-12 w-full h-12 text-gray-400 pointer-events-none select-none 
          text-[11px] md:text-base lg:text-lg font-normal flex items-center"
          style={{ fontFamily: "inherit" }}
        >
          <span className="invisible whitespace-pre">{busqueda}</span>
          <span className="ml-[1px] whitespace-pre">
            {sugerencia.slice(busqueda.length)}
          </span>
        </div>
      )}

      {/**Aqui es el funcionamiento del historial  */}
      {mostrarHistorial && (
        <ul className="absolute z-10 w-full bg-white border mt-1 rounded-md shadow-md max-h-60 overflow-y-auto">
          {historial.length > 0 ? (
            historial.map((item, index) => (
              <li
                key={index}
                className="px-4 py-2 flex justify-between items-center hover:bg-gray-100 text-sm text-gray-500"
              >
                <span
                  className="cursor-pointer w-full text-left"
                  onClick={() => handleSelectHistorial(item)}
                >
                  {item}
                </span>
                <button
                  className="ml-2 text-gray-400 hover:text-black"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleDeleteHistorial(item)}
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-center text-sm text-gray-400">
              No hay búsquedas guardadas.
            </li>
          )}
        </ul>
      )}
      {/* NUEVO: Mostrar boton de borrar historial */}
      {/* {historial.length > 0 && (
        <div className="border-t p-2 flex justify-center">
          <button
            className="text-red-500 text-sm hover:underline"
            onClick={handleBorrarTodoHistorial}
          >
            🗑️ Borrar historial
          </button>
        </div>
      )} */}
    </div>
  );
};
export default SearchBar;