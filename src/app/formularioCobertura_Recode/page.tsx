import { useState } from 'react';
import Header from '@/components/ui/Header';
import InsuranceForm from '@/components/InsuranceForm';
import CoverageTable from '@/components/CoverageTable';
import CoverageModal from '@/components/CoverageModal';

export default function CoberturaAutoPage() {
  const [hasInsurance, setHasInsurance] = useState(null);
  const [insuranceCompany, setInsuranceCompany] = useState('');
  const [validity, setValidity] = useState('');
  const [coverages, setCoverages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newCoverage, setNewCoverage] = useState({ name: '', description: '', amount: '', validity: '' });

  const handleSaveCoverage = async () => {
    if (!newCoverage.name || !newCoverage.amount) return;

    const coverageToSave = { ...newCoverage, validity: validity || 'Sin fecha' };

    // Simulación de inserción a base de datos
    try {
      const response = await fetch('/api/coberturas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(coverageToSave)
      });

      if (response.ok) {
        const saved = await response.json();
        setCoverages([...coverages, saved]); // o usar coverageToSave si no regresa nada
      } else {
        console.error('Error al guardar cobertura');
      }
    } catch (error) {
      console.error('Error de red:', error);
    }

    setNewCoverage({ name: '', description: '', amount: '', validity: '' });
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Header />
        <main className="bg-white rounded-xl shadow-sm overflow-hidden">
          <InsuranceForm {...{ hasInsurance, setHasInsurance, insuranceCompany, setInsuranceCompany, validity, setValidity }} />
          <CoverageTable coverages={coverages} setShowModal={setShowModal} />
        </main>
      </div>
      <CoverageModal {...{ showModal, setShowModal, newCoverage, setNewCoverage, handleSaveCoverage }} />
    </div>
  );
}
