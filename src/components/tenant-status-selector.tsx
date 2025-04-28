"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertCircle, CheckCircle, CheckCircle2, ChevronDown, Clock, Flag } from "lucide-react"

type TenantStatus = "active" | "pending" | "completed" | "cancelled" | "late"

interface TenantStatusSelectorProps {
  currentStatus: TenantStatus
  onStatusChange: (status: TenantStatus) => void
}

const statusConfig = {
  active: {
    label: "Activo",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
  },
  pending: {
    label: "Pendiente",
    color: "bg-amber-100 text-amber-800 border-amber-200",
    icon: Clock,
  },
  completed: {
    label: "Completado",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelado",
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: Flag,
  },
  late: {
    label: "Atrasado",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: AlertCircle,
  },
}

export function TenantStatusSelector({ currentStatus, onStatusChange }: TenantStatusSelectorProps) {
  const [status, setStatus] = useState<TenantStatus>(currentStatus)

  const handleStatusChange = (newStatus: TenantStatus) => {
    setStatus(newStatus)
    onStatusChange(newStatus)
  }

  const currentStatusConfig = statusConfig[status]
  const StatusIcon = currentStatusConfig.icon

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={`${currentStatusConfig.color} border gap-2`}>
          <StatusIcon className="h-4 w-4" />
          {currentStatusConfig.label}
          <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(statusConfig).map(([key, config]) => {
          const Icon = config.icon
          return (
            <DropdownMenuItem key={key} className="gap-2" onClick={() => handleStatusChange(key as TenantStatus)}>
              <Icon className="h-4 w-4" />
              {config.label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
