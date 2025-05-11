'use client';
import { useState } from 'react';
import { useCobertura } from '@/hooks/cobertura';
import FormularioSeguro from '@/components/recodeComponentes/cobertura/FormularioRecode';
import TablaCoberturas from '@/components/recodeComponentes/cobertura/TablaRecode';
import PopupCobertura from '@/components/recodeComponentes/cobertura/PopUpCobertura';
import ImageUploadButton from '@/components/recodeComponentes/cobertura/ImagenUpload';
import BotonValidacion from '@/components/recodeComponentes/cobertura/BotonValidacion';
import { useRouter } from 'next/navigation';

export default function CoberturaAutoPage() {
  const router = useRouter();
  const {
    seguro,
    guardarCobertura,
    eliminarCobertura,
    guardarImagen,
    actualizarSeguro,
    enviarDatos
  } = useCobertura();

  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitAll = async () => {
    setIsSubmitting(true);
    try {
      await enviarDatos();
      router.push('/condicionUsoAuto'); // Redirige después de validar
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        {!seguro.imagenAcreditacion && (
          <div className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Validación de Cobertura</h2>
            <p className="mb-6 text-gray-600">Por favor sube una imagen de acreditación para continuar</p>
            <div className="flex justify-center">
              <ImageUploadButton 
                onUploadComplete={guardarImagen}
              />
            </div>
          </div>
        )}

        {seguro.imagenAcreditacion && (
          <>
            <div className="p-4 border-b flex justify-between items-center">
              <ImageUploadButton 
                existingImage={seguro.imagenAcreditacion}
                onUploadComplete={guardarImagen}
              />
              <BotonValidacion
                onClick={handleSubmitAll}
                disabled={seguro.coberturas.length === 0}
                isLoading={isSubmitting}
              />
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
    </div>
  );
}