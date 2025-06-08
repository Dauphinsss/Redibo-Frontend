"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { LicenseData, LicensePhotos } from "./types";
import ProgressIndicator from "./progress-indicator";
import LicenseDataStep from "./license-data-step";
import LicensePhotosStep from "./license-photos-step";
import SuccessDialog from "./success-dialog";
import axios from "axios";
import { API_URL } from "@/utils/bakend";

export default function DriverApplicationForm() {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [licenseData, setLicenseData] = useState<LicenseData>({
    numeroLicencia: "",
    fechaEmision: "",
    fechaVencimiento: "",
    categoria: "",
  });
  const [licensePhotos, setLicensePhotos] = useState<LicensePhotos>({
    front: null,
    back: null,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  // NUEVO ESTADO PARA LOS ERRORES
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleLicenseDataChange = (field: keyof LicenseData, value: string) => {
    setLicenseData((prev) => ({ ...prev, [field]: value }));
    // LIMPIAR EL ERROR ESPECÍFICO DEL CAMPO CUANDO CAMBIA
        setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
          });
  };

  const handlePhotoChange = (type: "front" | "back", file: File | null) => {
    setLicensePhotos((prev) => ({ ...prev, [type]: file }));
    // LIMPIAR EL ERROR ESPECÍFICO DEL CAMPO CUANDO CAMBIA
        setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[type];
            return newErrors;
          });
  };
  // FUNCIÓN DE VALIDACIÓN PARA EL PASO 1
    const validateStep1 = () => {
      const newErrors: { [key: string]: string } = {};

      if (!licenseData.numeroLicencia) {
            newErrors.numeroLicencia = "Este campo es obligatorio.";
          }
        if (!licenseData.fechaEmision) {
            newErrors.fechaEmision = "Este campo es obligatorio.";
          }
        if (!licenseData.fechaVencimiento) {
            newErrors.fechaVencimiento = "Este campo es obligatorio.";
          }
        if (!licenseData.categoria) {
            newErrors.categoria = "Este campo es obligatorio.";
          }
    
          // Validar que la fecha de emisión sea anterior a la de vencimiento (si ambas están presentes)
          if (licenseData.fechaEmision && licenseData.fechaVencimiento) {
              const emisionDate = new Date(licenseData.fechaEmision);
              const vencimientoDate = new Date(licenseData.fechaVencimiento);
              // Para considerar el bug de fecha de vencimiento vacía, agregamos la condición
                // de que ambas fechas deben existir para esta validación específica de orden.
                if (emisionDate.getTime() >= vencimientoDate.getTime()) {
                    newErrors.fechaVencimiento = "La fecha de vencimiento debe ser posterior a la fecha de emisión.";
                  }
            }
    
          setErrors(newErrors); // Actualiza el estado de errores
        return Object.keys(newErrors).length === 0; // Retorna true si no hay errores
      };
  const isStep2Valid = () => {
    const newErrors: { [key: string]: string } = {};
        if (!licensePhotos.front) {
            newErrors.front = "La foto frontal es obligatoria.";
          }
        if (!licensePhotos.back) {
            newErrors.back = "La foto trasera es obligatoria.";
          }
        setErrors(newErrors); // Actualiza los errores para el paso 2 también
        return Object.keys(newErrors).length === 0;
  };
  
      // FUNCIÓN PARA MANEJAR EL AVANCE AL SIGUIENTE PASO
      const handleNextStep = () => {
          if (currentStep === 1) {
              if (validateStep1()) { // Llama a la validación del paso 1
                  setCurrentStep(currentStep + 1); // Solo avanza si el paso 1 es válido
                }
            }
          // Para el paso 2, el botón es "Enviar Solicitud", así que no hay lógica de avance aquí.
          };

  const handleSubmit = async () => {
    // VALIDA EL PASO 2 ANTES DE ENVIAR
    if (!isStep2Valid()) {
      return; // Detener si el paso 2 no es válido
    }

    setLoading(true);
    const authToken = localStorage.getItem("auth_token");
    const formdata = new FormData();
    console.log(licenseData);
    formdata.append("license", JSON.stringify(licenseData));
    formdata.append("front", licensePhotos.front as File);
    formdata.append("back", licensePhotos.back as File);
    console.log(formdata);
    try {
      await axios.post(`${API_URL}/api/request`, formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
      });
      localStorage.setItem("estadoConductor", "PENDING");
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error al enviar datos:", error);
      // Puedes establecer un error general de envío si lo deseas
      setErrors({ submit: "Error al enviar la solicitud. Por favor, inténtalo de nuevo." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background p-4">
      <div className="container mx-auto max-w-2xl pt-8">
        <div className="mb-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-foreground">
              Solicitud para Conductor
            </h1>
            <ProgressIndicator currentStep={currentStep} />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {currentStep === 1
                ? "Paso 1: Información de la Licencia"
                : "Paso 2: Fotos de la Licencia"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1
                ? "Ingresa los datos de tu licencia de conducir"
                : "Sube las fotos del anverso y reverso de tu licencia"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {currentStep === 1 && (
              <LicenseDataStep
                licenseData={licenseData}
                onDataChange={handleLicenseDataChange}
                errors={errors}
              />
            )}

            {currentStep === 2 && (
              <LicensePhotosStep
                licensePhotos={licensePhotos}
                onPhotoChange={handlePhotoChange}
                errors={errors}
              />
            )}

            <div className="flex justify-between pt-4">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Anterior
                </Button>
              )}

              <div className="ml-auto">
                {currentStep < 2 ? (
                  <Button
                    onClick={handleNextStep}
                  >
                    Siguiente
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    Enviar Solicitud
                    <Check className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
            {errors.submit && (
              <p className="text-red-500 text-sm mt-1 text-center">{errors.submit}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <SuccessDialog isOpen={isSubmitted} />
    </div>
  );
}
