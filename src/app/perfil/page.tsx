"use client"

import { useState } from "react"
import { useEffect } from "react"
import axios from "axios"
import { API_URL } from "@/utils/bakend"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { ProfileHeader } from "./profile-header"
import { PersonalInfo } from "./personal-info"
import { PaymentInfo } from "./payment-info"
import { DriverInfo } from "./driver-info"
import { RatingsInfo } from "./ratings-info"
import { CreditCard, User, Star, Car } from "lucide-react"
import { SteeringWheel } from "./steering-wheel-icon"
import Header from "@/components/ui/Header"
import { Footer } from "@/components/ui/footer"

type SectionType = "personal" | "payments" | "driver" | "ratings" | "vehicles";

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState<SectionType>("personal")
  const [roles, setRoles] = useState<string[]>([])

  useEffect(() => {
    const fetchRoles = async () => {
      const token = localStorage.getItem("auth_token")
      if (!token) return
  
      try {
        const res = await axios.get(`${API_URL}/api/perfil`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setRoles(res.data.roles || [])
      } catch (err) {
        console.error("Error al obtener roles del usuario", err)
      }
    }
  
    fetchRoles()
  }, [])
  

  const renderContent = () => {
    switch (activeSection) {
      case "personal":
        return <PersonalInfo />
      case "payments":
        return <PaymentInfo />
      case "driver":
        return <DriverInfo />
      case "ratings":
        return <RatingsInfo />
      case "vehicles":
        return <div>Sección de vehículos en desarrollo</div>
      default:
        return <PersonalInfo />
    }
  }

  return (
    <div className="flex flex-col min-h-screen w-full max-w-full overflow-hidden m-0 p-0">
      <Header />
      <div className="flex-1">
        <div className="px-4 md:px-6">
          <ProfileHeader />
        </div>

        <div className="mt-8 w-full m-0 p-0">
          <SidebarProvider>
            <div className="flex flex-col md:flex-row w-full m-0 p-0">
              <div className="w-64 md:w-72 shrink-0 md:border-r-2 md:border-black">
                <Sidebar side="left" collapsible="none" className="md:sticky md:top-8 md:self-start">
                  <SidebarContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          onClick={() => setActiveSection("personal")}
                          isActive={activeSection === "personal"}
                          className="justify-start border-2 border-gray-200 hover:border-black shadow-sm rounded-lg transition-all duration-200 hover:shadow-md px-2 py-1 text-sm"
                        >
                          <div className="p-2 mr-3">
                            <User className="h-5 w-5 text-black" />
                          </div>
                          <span className="font-medium">Información Personal</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          onClick={() => setActiveSection("payments")}
                          isActive={activeSection === "payments"}
                          className="justify-start border-2 border-gray-200 hover:border-black shadow-sm rounded-lg transition-all duration-200 hover:shadow-md px-2 py-1 text-sm"
                        >
                          <div className="p-2 mr-3">
                            <CreditCard className="h-5 w-5 text-black" />
                          </div>
                          <span className="font-medium">Tarjetas</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      {roles.includes("DRIVER") && (
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          onClick={() => setActiveSection("driver")}
                          isActive={activeSection === "driver"}
                          className="justify-start border-2 border-gray-200 hover:border-black shadow-sm rounded-lg transition-all duration-200 hover:shadow-md px-2 py-1 text-sm"
                        >
                          <div className="p-2 mr-3">
                            <SteeringWheel className="h-5 w-5 text-black" />
                          </div>
                          <span className="font-medium">Conductor</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                    
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          onClick={() => setActiveSection("ratings")}
                          isActive={activeSection === "ratings"}
                          className="justify-start border-2 border-gray-200 hover:border-black shadow-sm rounded-lg transition-all duration-200 hover:shadow-md px-2 py-1 text-sm"
                        >
                          <div className="p-2 mr-3">
                            <Star className="h-5 w-5 text-black" />
                          </div>
                          <span className="font-medium">Calificaciones</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          onClick={() => setActiveSection("vehicles")}
                          isActive={activeSection === "vehicles"}
                          className="justify-start border-2 border-gray-200 hover:border-black shadow-sm rounded-lg transition-all duration-200 hover:shadow-md px-2 py-1 text-sm"
                        >
                          <div className="p-2 mr-3">
                            <Car className="h-5 w-5 text-black" />
                          </div>
                          <span className="font-medium">Vehículos</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarContent>
                </Sidebar>
              </div>

              <main className="flex-1 min-h-[500px] bg-white p-0 w-full">
                <div className="p-9 w-full m-0">{renderContent()}</div>
              </main>
            </div>
          </SidebarProvider>
        </div>
      </div>
      <Footer />
    </div>
  )
}
