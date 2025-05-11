'use client';

interface BotonValidacionProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export default function BotonValidacion({
  onClick,
  disabled = false,
  isLoading = false
}: BotonValidacionProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-medium disabled:opacity-70 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
    >
      {isLoading ? (
        <>
          <Spinner />
          Validando...
        </>
      ) : (
        'Validar Cobertura'
      )}
    </button>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}