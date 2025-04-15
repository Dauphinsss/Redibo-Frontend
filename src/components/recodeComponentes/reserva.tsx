import React, { useState } from "react";

function ReservaButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleSubmit = () => {
    alert(`Reserva hecha a nombre de: ${name}`);
    setIsOpen(false); // Cierra el modal después de enviar
    setName(""); // Limpia el input
  };

  return (
    <div>
      {/* Botón de reserva */}
      <button
        onClick={handleOpen}
        className="bg-black text-white py-2 px-6 rounded hover:bg-gray-800"
      >
        RESERVAR
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h2 className="text-lg font-bold mb-4">Completa tu reserva</h2>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ingresa tu nombre:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 mb-4"
              placeholder="Tu nombre"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleClose}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Reservar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReservaButton;