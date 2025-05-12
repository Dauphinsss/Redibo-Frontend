import { memo } from 'react';

interface FormularioProps {
  hasInsurance: boolean | null;
  insuranceCompany: string;
  validity: string;
  setHasInsurance: (val: boolean) => void;
  setInsuranceCompany: (val: string) => void;
  setValidity: (val: string) => void;
}

function Formulario({
  hasInsurance,
  insuranceCompany,
  validity,
  setHasInsurance,
  setInsuranceCompany,
  setValidity,
}: FormularioProps) {
  return (
    <section className="p-4 md:p-6 border-b">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Cobertura de uso del auto</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cuenta con un seguro</label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="insurance"
                className="h-4 w-4 text-blue-600"
                checked={hasInsurance === true}
                onChange={() => setHasInsurance(true)}
              />
              <span className="ml-2">Sí</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="insurance"
                className="h-4 w-4 text-blue-600"
                checked={hasInsurance === false}
                onChange={() => setHasInsurance(false)}
              />
              <span className="ml-2">No</span>
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Aseguradora</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={insuranceCompany}
            onChange={(e) => setInsuranceCompany(e.target.value)}
            disabled={!hasInsurance}
          />
        </div>
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">Validez</label>
        <input
          type="date"
          className="p-2 border border-gray-300 rounded-md w-full md:w-auto"
          value={validity}
          onChange={(e) => setValidity(e.target.value)}
          disabled={!hasInsurance}
        />
      </div>
    </section>
  );
}

export default memo(Formulario);
