"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader2, AlertCircle } from "lucide-react"
import { API_URL } from "@/utils/bakend"

interface ReportProfileDialogProps {
  children: React.ReactNode
  renterId: string
  renterName: string
  viewerRoles: string[]
  targetUserRoles: { rol: string }[];
}

export default function ReportProfileDialog({ children, renterId, renterName, viewerRoles, targetUserRoles }: ReportProfileDialogProps) {
  const [reason, setReason] = useState("")
  const [additionalInfo, setAdditionalInfo] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [hasReportedBefore, setHasReportedBefore] = useState(false)
  const [reachedDailyLimit, setReachedDailyLimit] = useState(false)
  const maxLength = 200 // Límite máximo de caracteres

  const isViewerHost = viewerRoles.includes("HOST");
  const isTargetUserRenter = targetUserRoles.some(roleObj => roleObj.rol === "RENTER");
  const isViewingOwnProfile = false; 

  useEffect(() => {
    const checkPreviousReports = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        if (!token || !renterId) return

        const response = await fetch(`${API_URL}/api/reportes?reportadoId=${renterId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const reports = await response.json()
          const hasReported = reports.some((report: { estado: string }) => report.estado !== "RECHAZADO")
          setHasReportedBefore(hasReported)
        }
      } catch (error) {
        console.error("Error checking previous reports:", error)
      }
    }

    if (isOpen) {
      checkPreviousReports()
      setReachedDailyLimit(false) 
    }
  }, [renterId, isOpen])

  useEffect(() => {
    if (!isOpen) {
      setReason("");
      setAdditionalInfo("");
    }
  }, [isOpen]);

  if (!isViewerHost || !isTargetUserRenter || isViewingOwnProfile) {
    return null;
  }

  const handleAdditionalInfoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
   
    const cleanedText = text.substring(0, maxLength)
    setAdditionalInfo(cleanedText)
  }

  const handleSubmit = async () => {
    if (hasReportedBefore) {
      toast.error("Ya has reportado a este usuario anteriormente")
      setIsOpen(false)
      return
    }

    if (!reason) {
      toast.error("Por favor, seleccione un motivo para el reporte")
      return
    }

    if (additionalInfo.length > maxLength) {
      toast.error(`La información adicional no puede exceder los ${maxLength} caracteres`)
      return
    }

    // Validación para "otro motivo"
    if (reason === "otro" && additionalInfo.trim() === "") {
      toast.error("Cuando selecciona 'Otro motivo', debe proporcionar información adicional")
      return
    }

    setIsSubmitting(true)

    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_URL}/api/reportes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_reportado: renterId,
          motivo: reason,
          informacion_adicional: additionalInfo,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.error.includes("límite de reportes")) {
          setReachedDailyLimit(true)
          toast.error("Has alcanzado el límite de reportes por día")
        } else if (data.error.includes("reportado a este usuario")) {
          setHasReportedBefore(true)
          toast.error("Ya has reportado a este usuario anteriormente")
        } else {
          toast.error(data.error || "No se pudo enviar el reporte")
        }
        throw new Error(data.error)
      }

      toast.success("Reporte enviado. Su reporte ha sido enviado correctamente y será revisado por nuestro equipo.")
      setReason("")
      setAdditionalInfo("")
      setIsOpen(false)
    } catch (error) {
      console.error("Error submitting report:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getDialogMessage = () => {
    if (hasReportedBefore) {
      return (
        <>
          <AlertCircle className="h-4 w-4 mr-2 inline" />
          <span className="text-black text-sm">
            Ya has reportado a este usuario anteriormente. No puedes enviar múltiples reportes al mismo usuario.
          </span>
        </>
      )
    }
    if (reachedDailyLimit) {
      return (
        <div className="mt-2 flex items-center black text-sm">
          <AlertCircle className="h-4 w-4 mr-2" />
          Has alcanzado el límite de reportes por día (2 reportes/24 horas).
        </div>
      )
    }
    return "Por favor, indique el motivo por el cual está reportando a este arrendatario. Los reportes son anónimos y serán revisados por nuestro equipo."
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[500px] overflow-y-auto w-full border rounded-lg shadow-md">
        <DialogHeader className="pb-2 border-b">
          <DialogTitle className="text-xl font-semibold text-gray-800">Reportar a {renterName}</DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            {getDialogMessage()}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-3 max-h-[300px] overflow-y-auto px-1">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Motivo del reporte</label>
            <Select 
              value={reason} 
              onValueChange={setReason} 
              disabled={hasReportedBefore || reachedDailyLimit}
            >
              <SelectTrigger className="w-full border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:border-black">
                <SelectValue placeholder="Seleccione un motivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="información_falsa">Información falsa en el perfil</SelectItem>
                <SelectItem value="comportamiento_inapropiado">Comportamiento inapropiado</SelectItem>
                <SelectItem value="daños_propiedad">Daños a la propiedad</SelectItem>
                <SelectItem value="incumplimiento_normas">Incumplimiento de normas</SelectItem>
                <SelectItem value="otro">Otro motivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex justify-between items-center">
              <span>Información adicional</span> 
              <span className="text-xs text-gray-500">
                ({additionalInfo.length}/{maxLength} caracteres)
              </span>
            </label>
            <Textarea
              placeholder="Proporcione detalles adicionales sobre el reporte..."
              value={additionalInfo}
              onChange={handleAdditionalInfoChange}
              rows={3}
              maxLength={maxLength}
              className="resize-none w-full overflow-auto break-all max-h-[80px] whitespace-pre-wrap text-sm border border-black rounded-md focus:ring-1 focus:ring-black focus:border-black"
              disabled={hasReportedBefore || reachedDailyLimit}
              style={{ 
                wordWrap: "break-word", 
                overflowWrap: "break-word",
                wordBreak: "break-all",
                whiteSpace: "pre-wrap",
                textOverflow: "ellipsis"
              }}
            />
            {reason === "otro" && (
              <p className="text-xs text-black flex items-center mt-1">
                <AlertCircle className="h-3 w-3 mr-1 text-black" />
                Este motivo requiere información adicional
              </p>
            )}
          </div>
        </div>
        <DialogFooter className="pt-2 border-t flex gap-2 justify-end">
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)} 
            disabled={isSubmitting}
            className="border-black text-black bg-white hover:bg-black hover:text-white"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || hasReportedBefore || reachedDailyLimit}
            variant={hasReportedBefore || reachedDailyLimit ? "destructive" : "default"}
            className={hasReportedBefore || reachedDailyLimit ? "bg-black text-white"    : "bg-white text-black hover:bg-black hover:text-white"}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : hasReportedBefore ? (
              "No se permiten múltiples reportes"
            ) : reachedDailyLimit ? (
              "Límite de reportes alcanzado"
            ) : (
              "Enviar reporte"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}