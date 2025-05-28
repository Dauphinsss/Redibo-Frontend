"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Shield, Mail, Phone, AlertCircle } from "lucide-react"

interface VerifiedInfoProps {
  name: string
  verifiedItems: {
    identity: boolean
    email: boolean
    phone: boolean
  }
}

export default function VerifiedInfo({ name, verifiedItems }: VerifiedInfoProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-medium mb-3">Información verificada</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <div className={`mr-2 ${verifiedItems.identity ? "text-black":"text-gray-300"}`}>
              {verifiedItems.identity ? (
                <Shield className="h-4 w-4 fill-black" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
            </div>
            <span className="text-sm">
              {verifiedItems.identity ? `Identidad de ${name} verificada` : `Identidad no verificada`}
            </span>
          </div>

          <div className="flex items-center">
            <div className={`mr-2 ${verifiedItems.email ? "text-black" : "text-gray-300"}`}>
              {verifiedItems.email ? <Mail className="h-4 w-4 fill-black"/> : <AlertCircle className="h-4 w-4" />}
            </div>
            <span className="text-sm">
              {verifiedItems.email ? "Correo electrónico verificado" : "Correo electrónico no verificado"}
            </span>
          </div>

          <div className="flex items-center">
            <div className={`mr-2 ${verifiedItems.phone ? "text-black" : "text-gray-300"}`}>
              {verifiedItems.phone ? <Phone className="h-4 w-4 fill-black" /> : <AlertCircle className="h-4 w-4" />}
            </div>
            <span className="text-sm">
              {verifiedItems.phone ? "Número de teléfono verificado" : "Número de teléfono no verificado"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}