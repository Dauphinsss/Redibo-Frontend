'use client';
import { useState } from 'react';
import { SeguroForm, Cobertura, CoberturaResponse } from '../interface/CoberturaForm_Interface_Recode';

export const useCobertura = () => {
  const [seguro, setSeguro] = useState<SeguroForm>({
    tieneSeguro: false,
    coberturas: [],
    imagenAcreditacion: undefined
  });

  const guardarCobertura = (cobertura: Cobertura, index?: number) => {
    setSeguro(prev => {
      const nuevasCoberturas = [...prev.coberturas];
      
      if (typeof index === 'number') {
        nuevasCoberturas[index] = cobertura;
      } else {
        nuevasCoberturas.push(cobertura);
      }
      
      return {
        ...prev,
        coberturas: nuevasCoberturas
      };
    });
  };

  const eliminarCobertura = (index: number) => {
    setSeguro(prev => ({
      ...prev,
      coberturas: prev.coberturas.filter((_, i) => i !== index)
    }));
  };

  const guardarImagen = (url: string) => {
    setSeguro(prev => ({
      ...prev,
      imagenAcreditacion: url
    }));
  };

  const actualizarSeguro = (datos: Partial<SeguroForm>) => {
    setSeguro(prev => ({
      ...prev,
      ...datos
    }));
  };

  const enviarDatos = async (idCarro: number): Promise<CoberturaResponse> => {
    const response = await fetch(`https://search-car-backend.vercel.app/insurance/${idCarro}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...seguro,
        coberturas: seguro.coberturas.map(c => ({
          tipoda_o: c.tipoDaño,
          descripcion: c.descripcion,
          valides: c.monto // Asumiendo que monto va en valides
        }))
      })
    });

    if (!response.ok) {
      throw new Error('Error al enviar los datos');
    }

    return await response.json();
  };

  return {
    seguro,
    guardarCobertura,
    eliminarCobertura,
    guardarImagen,
    actualizarSeguro,
    enviarDatos
  };
};