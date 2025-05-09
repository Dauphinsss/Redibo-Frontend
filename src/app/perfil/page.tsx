"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/utils/bakend";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { ProfileHeader } from "./profile-header";
import { PersonalInfo } from "./personal-info";
import { PaymentInfo } from "./payment-info";
import { DriverInfo } from "./driver-info";
import { RatingsInfo } from "./ratings-info";
import { VehiclesInfo } from "./vehicles-info";
import {
  CreditCard,
  User,
  Star,
  Car,
  Menu,
  ChevronRight,
  LogOut,
  Settings,
  HelpCircle,
} from "lucide-react";
import { SteeringWheel } from "./steering-wheel-icon";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Link from "next/link";

type SectionType = "personal" | "payments" | "driver" | "ratings" | "vehicles";

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState<SectionType>("personal");
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      try {
        const res = await axios.get(`${API_URL}/api/perfil`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        localStorage.setItem("roles", res.data.roles);
        setRoles(res.data.roles || []);
      } catch (err) {
        console.error("Error al obtener datos del usuario", err);
      }
    };

    fetchUserData();
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case "personal":
        return <PersonalInfo />;
      case "payments":
        return <PaymentInfo />;
      case "driver":
        return <DriverInfo />;
      case "ratings":
        return <RatingsInfo />;
      case "vehicles":
        return <VehiclesInfo />;
      default:
        return <PersonalInfo />;
    }
  };

  const sectionTitles = {
    personal: "Información Personal",
    payments: "Tarjetas",
    driver: "Conductor",
    ratings: "Calificaciones",
    vehicles: "Vehículos",
  };

  const menuItems = [
    {
      id: "personal",
      title: "Información Personal",
      icon: User,
      alwaysShow: true,
    },
    {
      id: "payments",
      title: "Tarjetas",
      icon: CreditCard,
      alwaysShow: true,
    },
    {
      id: "driver",
      title: "Conductor",
      icon: SteeringWheel,
      alwaysShow: false,
      requiresRole: "DRIVER",
    },
    {
      id: "ratings",
      title: "Calificaciones",
      icon: Star,
      alwaysShow: true,
    },
    {
      id: "vehicles",
      title: "Vehículos",
      icon: Car,
      alwaysShow: true,
    },
  ];

  return (
    <div className="flex flex-col  w-full max-w-full overflow-hidden bg-gray-50">
      <div className="flex-1">
        <div className="w-full">
          <SidebarProvider>
            {/* Sidebar para móvil y escritorio */}
            <Sidebar
              side="left"
              collapsible="offcanvas"
              className="border-r border-gray-100 shadow-sm bg-white "
            >
              <SidebarContent className="p-2 bg-white">
                <div className="mb-2 px-3 py-2">
                  <Link href="/">
                    <h3 className="tracking-wider text-black font-bold text-xl">
                      REDIBO
                    </h3>
                  </Link>
                </div>

                <SidebarMenu className="bg-white">
                  {menuItems.map((item) => {
                    // Mostrar el ítem si siempre debe mostrarse o si el usuario tiene el rol requerido
                    if (
                      item.alwaysShow ||
                      (item.requiresRole && roles.includes(item.requiresRole))
                    ) {
                      return (
                        <SidebarMenuItem key={item.id}>
                          <SidebarMenuButton
                            onClick={() =>
                              setActiveSection(item.id as SectionType)
                            }
                            isActive={activeSection === item.id}
                            className={cn(
                              "justify-start rounded-lg transition-all duration-200 px-3 py-2 text-sm my-1",
                              "hover:bg-gray-50",
                              activeSection === item.id
                                ? "bg-gray-100 font-medium text-primary"
                                : "text-gray-700"
                            )}
                          >
                            <item.icon
                              className={cn(
                                "h-5 w-5 mr-3",
                                activeSection === item.id
                                  ? "text-primary"
                                  : "text-gray-500"
                              )}
                            />
                            <span>{item.title}</span>
                            {activeSection === item.id && (
                              <ChevronRight className="ml-auto h-4 w-4 text-primary" />
                            )}
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    }
                    return null;
                  })}
                </SidebarMenu>

                <Separator className="my-4" />

                <div className="mb-2 px-3 py-2">
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Soporte
                  </h3>
                </div>

                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton className="justify-start rounded-lg transition-all duration-200 px-3 py-2 text-sm my-1 hover:bg-gray-100 text-gray-700">
                      <HelpCircle className="h-5 w-5 mr-3 text-gray-500" />
                      <span>Ayuda</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton className="justify-start rounded-lg transition-all duration-200 px-3 py-2 text-sm my-1 hover:bg-gray-100 text-gray-700">
                      <Settings className="h-5 w-5 mr-3 text-gray-500" />
                      <span>Configuración</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarContent>

              <SidebarFooter className="p-4 border-t border-gray-100">
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar sesión
                </Button>
              </SidebarFooter>
            </Sidebar>

            {/* Contenido principal con botón de menú para móvil */}
            <SidebarInset>
                <div className="flex items-center p-2 bg-white md:hidden border rounded-lg m-4 z-50 fixed ">
                <SidebarTrigger className="mr-3">
                  <Menu className="h-5 w-5" />
                </SidebarTrigger>
                <h2 className="text-base font-medium">
                  {sectionTitles[activeSection]}
                </h2>
                </div>

              <main className="flex-1  w-full sm:p-10">
                <ProfileHeader />

                <div className="  p-4 md:p-6 lg:p-8">
                  <div className="  overflow-hidden">
                    <div className="p-6  pt-0 border-b border-gray-100 ">
                      <h1 className="text-2xl font-semibold text-gray-900">
                        {sectionTitles[activeSection]}
                      </h1>
                      <p className="text-sm text-gray-500 mt-1">
                        Gestiona tu información de{" "}
                        {sectionTitles[activeSection].toLowerCase()}
                      </p>
                    </div>
                    <div className="p-4 md:p-6">{renderContent()}</div>
                  </div>
                </div>
              </main>
              <Footer />
            </SidebarInset>
          </SidebarProvider>
        </div>
      </div>
    </div>
  );
}
