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
import { RatingsInfo } from "./ratings-info";
import { VehiclesInfo } from "./vehicles-info";
import { ReservationsList } from "./orders-info";
import { SecurityInfo } from "./security-info";
import {
  User,
  Star,
  Car,
  Menu,
  ChevronRight,
  LogOut,
  Settings,
  HelpCircle,
  Receipt,
  BadgeDollarSign,
  CarFront,
  Users,
  Shield,
} from "lucide-react";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { BecomeDriver } from "./become-driver";

type SectionType =
  | "personal"
  | "payments"
  | "becomeDriver"
  | "ratings"
  | "vehicles"
  | "orders"
  | "socios"
  | "security";

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState<SectionType>("personal");
  const [roles, setRoles] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const touchThreshold = 70; // deslizamiento válido

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        window.location.href = "/login";
      }

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

  const handleTouchStart = (e: TouchEvent): void => {
    // detectar deslizamientos borde izquierdo
    if (e.touches[0].clientX <= 30) {
      setTouchStartX(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = (e: TouchEvent): void => {
    if (touchStartX > 0) {
      const touchEndX = e.changedTouches[0].clientX;
      const deltaX = touchEndX - touchStartX;
      if (deltaX > touchThreshold) {
        // Emular un clic
        const sidebarTrigger = document.querySelector('[data-sidebar-trigger="true"]') as HTMLElement;
        if (sidebarTrigger) {
          sidebarTrigger.click();
        }
        setIsSidebarOpen(!isSidebarOpen);
      }
      setTouchStartX(0);
    }
  };

  useEffect(() => {
    const handleTouchStartEvent = (e: TouchEvent): void => handleTouchStart(e);
    const handleTouchEndEvent = (e: TouchEvent): void => handleTouchEnd(e);
    
    document.addEventListener('touchstart', handleTouchStartEvent, { passive: true });
    document.addEventListener('touchend', handleTouchEndEvent, { passive: true });
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStartEvent);
      document.removeEventListener('touchend', handleTouchEndEvent);
    };
  }, [touchStartX]);

  const renderContent = () => {
    switch (activeSection) {
      case "personal":
        return <PersonalInfo />;
      case "payments":
        return <PaymentInfo />;
      case "becomeDriver":
        return <BecomeDriver />;
      case "ratings":
        return <RatingsInfo />;
      case "vehicles":
        return <VehiclesInfo />;
      case "orders":
        return <ReservationsList />;
      case "security":
        return <SecurityInfo />;
      case "socios":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4">
              {roles.includes('RENTER') && (
                <Link href="/perfil/socios/conductores">
                  <div
                    className="w-full sm:w-64 h-40 bg-black text-white hover:bg-gray-900 rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-md hover:shadow-lg cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out"
                  >
                    <Users className="h-10 w-10 mb-3" />
                    <p className="text-lg font-semibold">Ver mis conductores</p>
                  </div>
                </Link>
              )}
              {roles.includes('DRIVER') && (
                <Link href="/perfil/socios/arrendatarios">
                   <div
                    className="w-full sm:w-64 h-40 bg-black text-white hover:bg-gray-900 rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-md hover:shadow-lg cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out"
                  >
                    <Users className="h-10 w-10 mb-3" />
                    <p className="text-lg font-semibold">Ver mis arrendatarios</p>
                  </div>
                </Link>
              )}
            </div>
          </div>
        );
      default:
        return <PersonalInfo />;
    }
  };

  const sectionTitles = {
    personal: "Información Personal",
    payments: "Mi Billetera",
    driver: "Conductor",
    becomeDriver: "Soy Conductor",
    ratings: "Calificaciones",
    vehicles: "Vehículos",
    orders: "Órdenes de Pago",
    socios: "Mis Socios",
    security: "Seguridad"
  };

  const menuItems = [
    {
      id: "personal",
      title: "Información Personal",
      icon: User,
      alwaysShow: true,
    },
    {
      id: "security",
      title: "Seguridad",
      icon: Shield,
      alwaysShow: true,
    },
    {
      id: "payments",
      title: "Mi Billetera",
      icon: BadgeDollarSign,
      alwaysShow: true,
    },
    {
      id: "becomeDriver",
      title: "Soy Conductor",
      icon: CarFront,
      alwaysShow: true,
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
    {
      id: "orders",
      title: "Órdenes de Pago",
      icon: Receipt,
      alwaysShow: false,
      requiresRole: "RENTER",
    },
    {
      id: "socios",
      title: "Socios",
      icon: Users,
      alwaysShow: false,
      requiresRole: ["RENTER", "DRIVER"],
    },
  ];

  const handleLogout = () => {
    localStorage.clear(); // Limpia toda la sesión
    window.location.href = "/"; // Redirige a la página de inicio
  };

  return (
    <div className="flex flex-col  w-full max-w-full overflow-hidden bg-gray-50">
      <div className="flex-1">
        <div className="w-full">
          <SidebarProvider>
            {/* Sidebar para móvil y escritorio */}
            <Sidebar
              side="left"
              collapsible="offcanvas"
              className="border-r border-gray-100 shadow-sm bg-white"
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
                    if (
                      item.alwaysShow ||
                      (item.requiresRole && 
                        (Array.isArray(item.requiresRole) 
                          ? item.requiresRole.some(role => roles.includes(role))
                          : roles.includes(item.requiresRole)))
                    ) {
                      return (
                        <SidebarMenuItem key={item.id}>
                          <SidebarMenuButton
                            onClick={() => {
                              setActiveSection(item.id as SectionType);
                              setIsSidebarOpen(false);
                            }}
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
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar sesión
                </Button>
              </SidebarFooter>
            </Sidebar>

            {/* Contenido principal con botón de menú para móvil */}
            <SidebarInset>
              <div 
                className="fixed left-0 top-0 bottom-0 w-8 z-40 md:hidden" 
                style={{ backgroundColor: 'transparent' }}
                aria-hidden="true"
              />
              
              <div className="flex items-center p-2 bg-white md:hidden border rounded-lg m-4 z-50 fixed ">
                <SidebarTrigger
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  data-sidebar-trigger="true"
                >
                  <Menu className="h-5 w-5" />
                </SidebarTrigger>
              </div>

              <main className="flex-1  w-full mt-8 sm:p-10">
                <ProfileHeader />

                <div className="  p-4 md:p-6 lg:p-8">
                  <div className="  overflow-hidden">
                    <div className="p-6  pt-0 border-b border-gray-100 ">
                      <h1 className="text-2xl font-semibold text-gray-900">
                        {sectionTitles[activeSection]}
                      </h1>
                      <p className="text-sm text-gray-500 mt-1">
                        Gestiona tu información personal y configuración de
                        cuenta
                      </p>
                    </div>
                    <div>{renderContent()}</div>
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