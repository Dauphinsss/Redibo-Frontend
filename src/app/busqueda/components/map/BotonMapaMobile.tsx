import { Map } from "lucide-react";

export default function BotonMapaMovil({ onClick }: { onClick: () => void }) {
  return (
    <div className="fixed bottom-0 right-6 z-50 lg:hidden">
      <button
        onClick={onClick}
        className="bg-black text-white p-3 rounded-full shadow-lg mb-6"
      >
        <Map size={24} />
      </button>
    </div>
  );
}