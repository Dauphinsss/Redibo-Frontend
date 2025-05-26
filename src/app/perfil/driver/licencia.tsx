import { Card, CardContent } from "@/components/ui/card";
import { Calendar, User, CreditCard, Clock } from "lucide-react";
import Image from "next/image";

export interface Licencia {
  numeroLicencia: string;
  fechaEmision: string;
  fechaVencimiento: string;
  categoria: string;
  nombre: string;
  foto: string;
  fecha_nacimiento: string;
  genero: string;
}

interface LicenciaConducirProps {
  data: Licencia;
}

export function LicenciaConducir({ data }: LicenciaConducirProps) {
  const formatearFecha = (fechaISO: string) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString("es-BO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const calcularEdad = (fechaNacimiento: string) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }

    return edad;
  };

  const esVencida = (fechaVencimiento: string) => {
    return new Date(fechaVencimiento) < new Date();
  };

  return (
    <div className="w-full max-w-3xl">
      <Card className="overflow-hidden shadow-lg border border-gray-300">
        {/* Header */}
        <div className="bg-gray-900 text-white p-4 -mt-6">
          <div className="text-center">
            <h2 className="text-xl font-bold tracking-wide">
              ESTADO PLURINACIONAL DE BOLIVIA
            </h2>
            <p className="text-gray-300 text-sm font-medium tracking-widest">
              LICENCIA DE CONDUCIR
            </p>
          </div>
        </div>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sección de foto */}
            <div className="md:col-span-1">
              <div className="text-center">
                <div className="w-36 h-36 mx-auto border-2 border-gray-400 rounded overflow-hidden bg-gray-100 mb-3">
                  <Image
                    src={data.foto || "/placeholder.svg"}
                    alt={`Foto de ${data.nombre}`}
                    width={144}
                    height={144}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-5xl md:text-8xl  text-gray-900">
                  <p className="text-sm">CATEGORÍA</p>
                  <p className="font-black">{data.categoria}</p>
                </div>
              </div>
            </div>

            {/* Información principal */}
            <div className="md:col-span-2 space-y-4">
              {/* Número de licencia */}

              {/* Nombre */}
              <div className="border-l-4 border-gray-600 pl-4 bg-gray-50 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-5 h-5 text-gray-700" />
                  <p className="text-xs font-medium text-gray-600 uppercase">
                    Nombre Completo
                  </p>
                </div>
                <p className="text-lg font-bold text-gray-900">{data.nombre}</p>
              </div>

              <div className="border-l-4 border-gray-800 pl-4 bg-gray-50 p-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-gray-700" />
                  <div>
                    <p className="text-xs font-medium text-gray-600 uppercase">
                      Número de Licencia
                    </p>
                    <p className="font-mono text-xl font-bold text-gray-900 tracking-wider">
                      {data.numeroLicencia}
                    </p>
                  </div>
                </div>
              </div>
              {/* Grid de información */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3 border border-gray-200">
                  <div className="flex items-center gap-1 mb-1">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <p className="text-xs font-medium text-gray-600">
                      Nacimiento
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {formatearFecha(data.fecha_nacimiento)}
                  </p>
                  <p className="text-xs text-gray-600">
                    {calcularEdad(data.fecha_nacimiento)} años
                  </p>
                </div>

                <div className="bg-white p-3 border border-gray-200">
                  <div className="flex items-center gap-1 mb-1">
                    <User className="w-4 h-4 text-gray-600" />
                    <p className="text-xs font-medium text-gray-600">Género</p>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {data.genero}
                  </p>
                </div>

                <div className="bg-white p-3 border border-gray-200">
                  <div className="flex items-center gap-1 mb-1">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <p className="text-xs font-medium text-gray-600">Emisión</p>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {formatearFecha(data.fechaEmision)}
                  </p>
                </div>

                <div
                  className={`p-3 border ${
                    esVencida(data.fechaVencimiento)
                      ? "bg-gray-200 border-gray-400"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-1 mb-1">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <p className="text-xs font-medium text-gray-600">
                      Vencimiento
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {formatearFecha(data.fechaVencimiento)}
                  </p>
                  {esVencida(data.fechaVencimiento) && (
                    <p className="text-xs text-gray-700 font-bold">VENCIDA</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
