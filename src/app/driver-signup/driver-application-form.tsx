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

  const handleLicenseDataChange = (field: keyof LicenseData, value: string) => {
    setLicenseData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (type: "front" | "back", file: File | null) => {
    setLicensePhotos((prev) => ({ ...prev, [type]: file }));
  };

  const isStep1Valid = () => {
    return (
      licenseData.numeroLicencia &&
      licenseData.fechaEmision &&
      licenseData.fechaVencimiento &&
      licenseData.categoria
    );
  };

  const isStep2Valid = () => {
    return licensePhotos.front && licensePhotos.back;
  };

  const handleSubmit = async () => {
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
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error al enviar datos:", error);
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
              />
            )}

            {currentStep === 2 && (
              <LicensePhotosStep
                licensePhotos={licensePhotos}
                onPhotoChange={handlePhotoChange}
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
                    onClick={() => setCurrentStep(currentStep + 1)}
                    disabled={!isStep1Valid()}
                  >
                    Siguiente
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!isStep2Valid() || loading}
                  >
                    Enviar Solicitud
                    <Check className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <SuccessDialog isOpen={isSubmitted} />
    </div>
  );
}
