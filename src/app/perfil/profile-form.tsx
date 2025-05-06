"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit, Save } from "lucide-react"

interface FormData {
  fullName: string
  email: string
  phone: string
}

interface FormErrors {
  fullName?: string
  email?: string
  phone?: string
}

export function ProfileForm() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    fullName: "Juan Pérez",
    email: "juan.perez@ejemplo.com",
    phone: "+34 612 345 678",
  })
  const [errors, setErrors] = useState<FormErrors>({})

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "El nombre completo es obligatorio"
    }

    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es obligatorio"
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "El formato del correo electrónico no es válido"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "El número de teléfono es obligatorio"
    } else if (!/^\+?[0-9\s]{8,15}$/.test(formData.phone)) {
      newErrors.phone = "El formato del número de teléfono no es válido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setIsEditing(false)
      // Aquí iría la lógica para guardar los cambios en el servidor
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="fullName">Nombre Completo</Label>
          <Input
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            disabled={!isEditing}
            className={errors.fullName ? "border-red-500" : ""}
          />
          {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Correo Electrónico</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!isEditing}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone">Número de Teléfono</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={!isEditing}
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
        </div>
      </div>

      <div className="flex justify-end">
        {isEditing ? (
          <Button type="submit" className="bg-black hover:bg-gray-800 text-white flex items-center gap-2">
            <Save size={16} />
            Guardar Cambios
          </Button>
        ) : (
          <Button
            type="button"
            onClick={() => setIsEditing(true)}
            className="bg-black hover:bg-gray-800 text-white flex items-center gap-2"
          >
            <Edit size={16} />
            Editar Información
          </Button>
        )}
      </div>
    </form>
  )
}
