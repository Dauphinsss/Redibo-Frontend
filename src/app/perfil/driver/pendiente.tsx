import { Clock, CheckCircle2, AlertCircle } from "lucide-react";

export default function Pendiente() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Tu solicitud para ser Conductor esta Pendiente</h2>

      <div className="border-l-4 border-gray-300 p-6 rounded-r-lg">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <Clock className="h-6 w-6 text-gray-600" />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Solicitud de Licencia de Conducir
              </h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                En proceso
              </span>
            </div>

            <p className="text-gray-700 mb-3">
              Tu solicitud está siendo procesada por nuestro equipo de
              validación.
            </p>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Documentos recibidos</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Validación en curso</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <AlertCircle className="h-4 w-4 text-gray-500" />
                <span className="text-gray-500">Aprobación pendiente</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-800">
                <strong>Tiempo estimado:</strong> La validación puede tardar
                hasta 48 horas en completarse. Te notificaremos cuando
                esté lista.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
