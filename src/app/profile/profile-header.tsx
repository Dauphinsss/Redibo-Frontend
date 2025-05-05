"use client"
import { useState } from "react"
import Image from "next/image"
import { MoreHorizontal, User } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function ProfileHeader() {
  const [profileImage, setProfileImage] = useState<string | null>(null)

  return (
    <div className="flex flex-col md:flex-row items-center gap-6">
      <div className="relative">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
          {profileImage ? (
            <Image
              src={profileImage || "/placeholder.svg"}
              alt="Foto de perfil"
              width={128}
              height={128}
              className="object-cover w-full h-full"
            />
          ) : (
            <User size={64} className="text-gray-400" />
          )}
        </div>
        <div className="absolute -bottom-2 -right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="bg-black text-white rounded-full p-2 hover:bg-gray-800 transition-colors">
                <MoreHorizontal size={20} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Asignar rol 1</DropdownMenuItem>
              <DropdownMenuItem>Asignar rol 2</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="text-center md:text-left">
        <h1 className="text-2xl font-bold">Juan Pérez</h1>
        <p className="text-gray-500">Miembro desde Enero 2023</p>
      </div>
    </div>
  )
}
