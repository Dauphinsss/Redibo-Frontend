"use client"

import { Button } from "@/components/ui/button"

import { FaWhatsapp } from "react-icons/fa"

interface ContactWhatsAppProps {
  phone: string
}
export default function ContactWhatsApp({ phone }: ContactWhatsAppProps) {
  const abrirNuevaPestana = () => {
    window.open(`/page2?phone=${phone}`, "_blank")
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        className="w-full bg-[#FCA311] hover:bg-[#E4D5C1] text-[#11295B]"
        onClick={abrirNuevaPestana}
      >
        
        <FaWhatsapp className="text-green-500 w-5 h-5 mr-2" color="black"/>

        WhatsApp
      </Button>
    </div>
  )
}