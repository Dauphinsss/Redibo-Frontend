'use client';

import { useEffect, useState } from "react";
import FormularioCobertura from "@/components/recodeComponentes/cobertura/FormularioRecode";
import TablaCoberturas from "@/components/recodeComponentes/cobertura/TablaRecode";
import PopupCobertura from "@/components/recodeComponentes/cobertura/PopUpCobertura";
import BotonValidar from "@/components/recodeComponentes/cobertura/BotonValidacion";
import { CoberturaInterface, ValidarInterface } from "@/interface/CoberturaForm_Interface_Recode";
import { getInsuranceByID } from "@/service/services_Recode";
import { useRouter } from "next/navigation";

interface Props {
  id_carro: string;
}

export default function CoberturaRecodeClient({ id_carro }: Props) {
  const router = useRouter();

  const [initialData, setInitialData] = useState<ValidarInterface | null>(null);
  const [loading, setLoading] = useState(true);

  const [coberturas, setCoberturas] = useState<CoberturaInterface[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [coberturaActual, setCoberturaActual] = useState<CoberturaInterface | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getInsuranceByID(id_carro);
        if (!data) {
          router.replace("/not-found"); // redirige a página 404
          return;
        }
        setInitialData(data);
        setCoberturaActual(crearCoberturaVacia(data.id_carro));
      } catch (error) {
        console.error("Error al cargar seguro:", error);
        router.replace("/error"); // activa error.tsx
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id_carro, router]);

  function crearCoberturaVacia(idCarro: number): CoberturaInterface {
    return {
      tipodaño: "",
      descripcion: "",
      valides: "",
      id_carro: idCarro,
    };
  }

  function agregarCobertura() {
    if (!coberturaActual || !initialData) return;

    if (isEditing) {
      const index = coberturas.findIndex(
        (c) =>
          c.tipodaño === coberturaActual.tipodaño &&
          c.valides === coberturaActual.valides
      );

      if (index !== -1) {
        const nuevas = [...coberturas];
        nuevas[index] = coberturaActual;
        setCoberturas(nuevas);
      }
    } else {
      setCoberturas([...coberturas, coberturaActual]);
    }

    cerrarPopup();
  }

  function cerrarPopup() {
    if (!initialData) return;
    setShowPopup(false);
    setCoberturaActual(crearCoberturaVacia(initialData.id_carro));
    setIsEditing(false);
  }

  if (loading) return <p className="text-center py-10">Cargando cobertura...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Cobertura de uso del auto</h1>

      <div className="border rounded shadow">
        <div className="bg-black text-white p-2 font-semibold">
          Cobertura de seguro
        </div>

        <div className="p-4 space-y-4">
          {initialData && <FormularioCobertura initialDataFor={initialData} />}

          <TablaCoberturas
            coberturas={coberturas}
            onEditar={(idx) => {
              setCoberturaActual(coberturas[idx]);
              setIsEditing(true);
              setShowPopup(true);
            }}
            onEliminar={(idx) => {
              const nuevas = coberturas.filter((_, i) => i !== idx);
              setCoberturas(nuevas);
            }}
            onAgregar={() => {
              if (initialData) {
                setCoberturaActual(crearCoberturaVacia(initialData.id_carro));
                setIsEditing(false);
                setShowPopup(true);
              }
            }}
          />

          <div className="mt-6 flex justify-center">
            <BotonValidar coberturas={coberturas} />
          </div>
        </div>
      </div>

      {showPopup && coberturaActual && (
        <PopupCobertura
          cobertura={coberturaActual}
          setCobertura={setCoberturaActual}
          onClose={cerrarPopup}
          onSave={agregarCobertura}
          isEditing={isEditing}
        />
      )}
    </div>
  );
}