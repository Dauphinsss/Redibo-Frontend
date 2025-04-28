import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle, FileCheck } from "lucide-react";

interface VerificationBadgesProps {
  verificaciones: string[]
}

export default function VerificationBadges({ verificaciones }: VerificationBadgesProps) {
  const getVerificationIcon = (type: string) => {
    switch (type) {
      case "identidad":
        return <Shield className="h-4 w-4" />
      case "email":
        return <CheckCircle className="h-4 w-4" />
      case "telefono":
        return <CheckCircle className="h-4 w-4" />
      case "licencia":
        return <FileCheck className="h-4 w-4" />
      default:
        return <CheckCircle className="h-4 w-4" />
    }
  }

  const getVerificationLabel = (type: string) => {
    switch (type) {
      case "identidad":
        return "Identidad verificada"
      case "email":
        return "Email verificado"
      case "telefono":
        return "Teléfono verificado"
      case "licencia":
        return "Licencia de conducir"
      default:
        return type
    }
  }

  return (
    <Card className="border-redibo-blue">
      <CardHeader className="pb-2 bg-redibo-blue text-redibo-white rounded-t-lg">
        <CardTitle className="text-sm">Verificaciones</CardTitle>
      </CardHeader>
      <CardContent className="pt-4 bg-redibo-bone rounded-b-lg">
        <div className="flex flex-wrap gap-2">
          {verificaciones.map((verificacion) => (
            <Badge
              key={verificacion}
              variant="outline"
              className="flex items-center gap-1 px-2 py-1 bg-redibo-white border-redibo-blue text-redibo-blue"
            >
              {getVerificationIcon(verificacion)}
              <span>{getVerificationLabel(verificacion)}</span>
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
