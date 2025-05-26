"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Car, ArrowRight, CheckCircle, Clock, FileText } from "lucide-react";
import Link from "next/link";

export function SolicitarLicencia() {
  return (
    <div className="w-full  mx-auto">
      <Card className="overflow-hidden border-0 shadow-none bg-gradient-to-">
        <CardContent className="p-0">
          {/* Header con patrón */}
          <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-8 text-white overflow-hidden rounded-2xl">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 w-32 h-32 border-4 border-white rounded-full"></div>
              <div className="absolute bottom-4 right-4 w-24 h-24 border-4 border-white rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-2 border-white rounded-full"></div>
            </div>

            <div className="relative z-10 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-white/50  p-4 rounded-full">
                  <Car className="w-12 h-12 text-white " />
                </div>
              </div>
              <h2 className="text-4xl font-black tracking-tight mb-2">
                ¿ERES CONDUCTOR?
              </h2>
              <p className="text-2xl font-bold text-gray-200 tracking-wide">
                SOLICITA AHORA
              </p>
              <div className="mt-4 w-24 h-1 bg-white mx-auto"></div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="py-4 md:p-8 md:text-left text-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Lado izquierdo - Beneficios */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Obtén tu licencia oficial
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Sube los datos y fotos de tu licencia actual para
                    convertirte en conductor. ¡Comienza el proceso de validación
                    de manera sencilla y segura!
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-900 p-2 rounded-full">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-gray-800">
                      Proceso 100% digital
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-gray-900 p-2 rounded-full">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-gray-800">
                      Respuesta en 24-48 horas
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-gray-900 p-2 rounded-full">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-gray-800">
                      Documentación mínima requerida
                    </span>
                  </div>
                </div>
              </div>

              {/* Lado derecho - CTA */}
              <div className="text-center lg:text-right">
                <div className="bg-gradient-to-b from-gray-100 to-gray-200 p-8 rounded-2xl border-2 border-gray-300 shadow-inner">
                  <div className="mb-6">
                    <div className="inline-block bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-bold tracking-wide mb-4">
                      TRÁMITE OFICIAL
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                      ¡Comienza ahora!
                    </h4>
                    <p className="text-gray-600">
                      Solo necesitas unos minutos para iniciar tu solicitud
                    </p>
                  </div>
                  <Link href="/driver-signup">
                    <Button
                      size="lg"
                      className="w-full hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      Solicitar Ahora <ArrowRight />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Footer con información adicional */}
            <div className="mt-8 pt-6 border-t-2 border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4">
                  <div className="text-3xl font-black text-gray-900 mb-1">
                    24/7
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    Atención disponible
                  </p>
                </div>
                <div className="p-4">
                  <div className="text-3xl font-black text-gray-900 mb-1">
                    100%
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    Proceso seguro
                  </p>
                </div>
                <div className="p-4">
                  <div className="text-3xl font-black text-gray-900 mb-1">
                    48H
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    Tiempo máximo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
