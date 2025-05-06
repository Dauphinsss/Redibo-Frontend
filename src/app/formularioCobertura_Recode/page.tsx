'use client';
import React, { useState, useEffect } from 'react';
import Formulario from '@/components/recodeComponentes/cobertura/FormularioRecode';
import TablaCobertura from '@/components/recodeComponentes/cobertura/TablaRecode';
import PopupCobertura from '@/components/recodeComponentes/cobertura/AñadirRecode';
import { Coverage } from '@/interface/CoberturaForm_Interface_Recode';
import BotonSiguiente from '@/components/recodeComponentes/cobertura/BotonSiguiente';

function CoberturaAutoPage() {
  const [hasInsurance, setHasInsurance] = useState<boolean | null>(null);
  const [insuranceCompany, setInsuranceCompany] = useState<string>('');
  const [validity, setValidity] = useState<string>('');
  const [coverages, setCoverages] = useState<Coverage[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newCoverage, setNewCoverage] = useState<Coverage>({
    name: '',
    description: '',
    amount: '',
    validity: '',
  });

  useEffect(() => {
    const data = localStorage.getItem('coverages');
    if (data) setCoverages(JSON.parse(data));
  }, []);

  useEffect(() => {
    localStorage.setItem('coverages', JSON.stringify(coverages));
  }, [coverages]);

  const handleSaveCoverage = () => {
    if (!newCoverage.name || !newCoverage.amount) return;
    const updated = [...coverages, { ...newCoverage, validity: validity || 'Sin fecha' }];
    setCoverages(updated);
    setNewCoverage({ name: '', description: '', amount: '', validity: '' });
    setShowModal(false);
  };

  const handleRemoveCoverage = (index: number) => {
    const updated = [...coverages];
    updated.splice(index, 1);
    setCoverages(updated);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        <Formulario
          hasInsurance={hasInsurance}
          insuranceCompany={insuranceCompany}
          validity={validity}
          setHasInsurance={setHasInsurance}
          setInsuranceCompany={setInsuranceCompany}
          setValidity={setValidity}
        />
        <TablaCobertura
          coverages={coverages}
          onRemove={handleRemoveCoverage}
          onAddClick={() => setShowModal(true)}
        />
      </div>
      {showModal && (
        <PopupCobertura
          newCoverage={newCoverage}
          setNewCoverage={setNewCoverage}
          onClose={() => setShowModal(false)}
          onSave={handleSaveCoverage}
        />
      )}
      <div className="w-full py-4 flex justify-center border-t mt-6">
        <BotonSiguiente to="/condicionUsoAuto" />
      </div>
    </div>
  );
}

export default CoberturaAutoPage;
