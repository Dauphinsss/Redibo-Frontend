// app/cobertura/page.tsx
'use client';
import { useCobertura } from '@/hooks/cobertura';
import FormularioSeguro from '@/components/recodeComponentes/cobertura/FormularioRecode';
import TablaCoberturas from '@/components/recodeComponentes/cobertura/TablaRecode';
import PopupCobertura from '@/components/recodeComponentes/cobertura/PopUpCobertura';
import ImageUploadPopup from '@/components/recodeComponentes/cobertura/ImagenUpload';
import BotonSiguiente from '@/components/recodeComponentes/cobertura/BotonValidacion';
import { useState } from 'react';

export default function CoberturaAutoPage() {
  const {
    seguro,
    guardarCobertura,
    eliminarCobertura,
    guardarImagen,
    actualizarSeguro,
    enviarDatos
  } = useCobertura();

  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [showValidationButton, setShowValidationButton] = useState(true);
  const [idCarro, setIdCarro] = useState(1); // Asume que obtienes el ID del auto de alguna manera

  const handleValidacion = async () => {
    try {
      const resultado = await enviarDatos(idCarro);
      if (resultado) {
        setShowImageModal(true);
      }
    } catch (error) {
      console.error("Error al validar:", error);
    }
  };

  const handleImageUploadSuccess = (url: string) => {
    guardarImagen(url);
    setShowValidationButton(false); // Oculta el botón de validación después de subir la imagen
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        {showValidationButton && (
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold">Validación de Cobertura</h2>
            <button 
              onClick={handleValidacion}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Iniciar Validación
            </button>
          </div>
        )}

        {!showValidationButton && (
          <>
            <div className="p-4 border-b">
              <button 
                onClick={() => setShowImageModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                {seguro.imagenAcreditacion ? 'Cambiar imagen' : 'Subir imagen de acreditación'}
              </button>
              {seguro.imagenAcreditacion && (
                <span className="ml-4 text-green-600">✓ Imagen subida</span>
              )}
            </div>
            
            <FormularioSeguro
              seguro={seguro}
              actualizarSeguro={actualizarSeguro}
            />
            
            <TablaCoberturas
              coberturas={seguro.coberturas}
              onEdit={(index) => {
                setEditIndex(index);
                setShowModal(true);
              }}
              onRemove={eliminarCobertura}
              onAdd={() => {
                setEditIndex(null);
                setShowModal(true);
              }}
            />
          </>
        )}
      </div>

      {showModal && (
        <PopupCobertura
          cobertura={editIndex !== null ? seguro.coberturas[editIndex] : undefined}
          onSave={(cobertura) => {
            guardarCobertura(cobertura, editIndex ?? undefined);
            setShowModal(false);
          }}
          onClose={() => setShowModal(false)}
        />
      )}

      {showImageModal && (
        <ImageUploadPopup
          onSave={handleImageUploadSuccess}
          onClose={() => setShowImageModal(false)}
        />
      )}

      {!showValidationButton && (
        <div className="w-full py-4 flex justify-center border-t mt-6">
          <BotonSiguiente 
            to="/condicionUsoAuto" 
            disabled={!seguro.imagenAcreditacion} 
          />
        </div>
      )}
    </div>
  );
}