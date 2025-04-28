"use client"
import React, { useState, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { QRCodeSVG } from "qrcode.react"
import { useSearchParams } from "next/navigation"
import { Copy, Check, Share2 } from "lucide-react"

/*page2*/ 
export default function Page2() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Page2Content />
    </Suspense>
  )
}

function Page2Content() {
  const searchParams = useSearchParams()
  const phone = searchParams.get("phone") ?? ""
  const [copiedQR, setCopiedQR] = useState(false)
  
  if (!phone) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#11295B]">
        <p className="text-[#FCA311] text-lg font-semibold">Número de teléfono no válido.</p>
      </div>
    )
  }

  const cleanPhone = phone.replace(/\D/g, "")
  const whatsappUrl = `https://wa.me/${cleanPhone}`

  const copyToClipboard = (text: string, setCopied: React.Dispatch<React.SetStateAction<boolean>>) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch((err) => console.error("Error al copiar:", err));
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "WhatsApp Link",
          text: "Envía un mensaje al instante con este enlace:",
          url: whatsappUrl,
        })
      } catch (error) {
        console.error("Error al compartir:", error)
      }
    } else {
      alert("La función de compartir no está disponible en este dispositivo.")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#E4D5C1] p-4">
      <h1 className="text-3xl font-bold text-black text-center mb-6">Contactar por WhatsApp</h1>
      <p className="text-lg text-center text-black mb-4">Escanee el código QR o haga clic en el botón para iniciar una conversación</p>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <QRCodeSVG value={whatsappUrl} size={200} />
      </div>

      <div className="flex items-center gap-2 mb-4 mt-6">
        <Button
          className="bg-[#FCA311] hover:bg-[#e59400] text-black px-24 py-2 border border-white text-lg"
          onClick={() => window.open(whatsappUrl, "_blank")}
        >
          ABRIR WHATSAPP
        </Button>
      </div>

      <div className="flex gap-6 mt-6">
        <Button
          className="bg-[#FCA311] hover:bg-[#e59400] text-black text-lg px-6 py-3 rounded-xl min-w-[180px] flex items-center justify-center"
          onClick={() => copyToClipboard(whatsappUrl, setCopiedQR)}
        >
          {copiedQR ? (
            <Check className="w-5 h-5 text-black" />
          ) : (
            <Copy className="w-5 h-5" />
          )}
          <span className="ml-2">Copiar</span>
        </Button>

        <Button
          className="bg-[#FCA311] hover:bg-[#e59400] text-black text-lg px-6 py-3 rounded-xl min-w-[180px] flex items-center justify-center"
          onClick={shareLink}
        >
          <Share2 className="w-5 h-5" />
          <span className="ml-2">Compartir</span>
        </Button>
      </div>
    </div>
  )
}
