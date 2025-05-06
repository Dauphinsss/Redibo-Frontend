
"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, User, LogIn, UserPlus, LogOut, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

// Definimos las props que el componente puede recibir
interface HeaderProps {
  /**
   * Si es true, fuerza la visualización del estado "sesión iniciada"
   * independientemente del estado interno. Útil para páginas que
   * requieren autenticación.
   */
  forceLoggedInView?: boolean;
  /**
   * Si es true, deshabilita la interacción con la mayoría de los
   * elementos (links de navegación, botones de auth, menú de usuario),
   * excepto el logo principal "REDIBO".
   */
  disableInteractions?: boolean;
}

export default function Header({
  forceLoggedInView = false, // Valor por defecto false
  disableInteractions = false, // Valor por defecto false
}: HeaderProps) {
  // Estado interno simulado (podría reemplazarse por estado global/contexto en el futuro)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Determina la vista de autenticación a mostrar
  // Prioriza el prop 'forceLoggedInView' si es true
  const showLoggedInView = forceLoggedInView || isLoggedIn;

  // --- Lógica para deshabilitar interacciones ---
  // Props para deshabilitar botones y triggers (semánticamente correcto)
  const disabledProps = disableInteractions ? { disabled: true } : {};

  // Clases y atributos para deshabilitar links (accesibilidad)
  const linkDisabledStyles = disableInteractions
    ? "pointer-events-none opacity-50 cursor-not-allowed" // Estilos visuales y de cursor
    : "";
  const linkDisabledAttrs = disableInteractions
    ? { "aria-disabled": true, tabIndex: -1 } // Atributos para accesibilidad
    : {};
  // --- Fin lógica para deshabilitar ---


  // Función auxiliar para combinar clases existentes con las de deshabilitación
  const getLinkClassName = (existingClasses: string = ""): string => {
    return `${existingClasses} ${linkDisabledStyles}`.trim();
  };

  return (
    <header className="border-b w-full"> {/* Añadido w-full para asegurar ancho completo */}
      <div className=" flex h-16 items-center justify-between px-4 md:px-6">
        {/* --- Logo (Siempre Activo) --- */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="font-bold text-xl" // No se aplican estilos de deshabilitación aquí
            aria-disabled="false" // Explícitamente activo
          >
            REDIBO
          </Link>
        </div>

        {/* --- Menú Móvil --- */}
        <div className="flex md:hidden">
          <Sheet>
            <SheetTrigger asChild {...disabledProps}>
              {/* Botón disparador del menú móvil */}
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px] sm:w-[300px]">
              <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
              <nav className="flex flex-col gap-4 mt-6 p-6">
                {/* Links de navegación móvil */}
                <Link
                  href="/"
                  className={getLinkClassName("text-sm font-medium")}
                  {...linkDisabledAttrs}
                >
                  Inicio
                </Link>
                <Link
                  href="/productos"
                  className={getLinkClassName("text-sm font-medium")}
                  {...linkDisabledAttrs}
                >
                  Productos
                </Link>
                <Link
                  href="/acerca"
                  className={getLinkClassName("text-sm font-medium")}
                  {...linkDisabledAttrs}
                >
                  Acerca de
                </Link>
                <Link
                  href="/contacto"
                  className={getLinkClassName("text-sm font-medium")}
                  {...linkDisabledAttrs}
                >
                  Contacto
                </Link>
                 <Link
                  href="/host"
                  className={getLinkClassName("text-sm font-medium text-blue-500")} // Manteniendo el color azul
                  {...linkDisabledAttrs}
                >
                  Host
                </Link>

                {/* Sección de Auth Móvil */}
                <div className="mt-4 border-t pt-4">
                  {showLoggedInView ? (
                    // Vista Logueado (Móvil)
                    <>
                      <div className="flex items-center gap-2 mb-4">
                        <Avatar className="h-8 w-8">
                           {/* Considerar añadir AvatarImage si se tienen datos */}
                          <AvatarFallback>US</AvatarFallback> {/* TODO: Hacer dinámico */}
                        </Avatar>
                        <div className="text-sm font-medium">Usuario</div> {/* TODO: Hacer dinámico */}
                      </div>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => !disableInteractions && setIsLoggedIn(false)} // Acción solo si no está deshabilitado
                        {...disabledProps} // Aplicar disabled
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Cerrar sesión
                      </Button>
                    </>
                  ) : (
                    // Vista Deslogueado (Móvil)
                    <>
                      <Button
                        variant="default"
                        className="w-full justify-start mb-2"
                        onClick={() => !disableInteractions && setIsLoggedIn(true)} // Acción solo si no está deshabilitado
                        {...disabledProps} // Aplicar disabled
                      >
                        <LogIn className="mr-2 h-4 w-4" />
                        Iniciar sesión
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                         // onClick={() => { /* TODO: Navegar a página de registro */ }}
                        {...disabledProps} // Aplicar disabled
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Registrarse
                      </Button>
                    </>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* --- Navegación Desktop --- */}
        <nav className="hidden md:flex justify-center items-center gap-6">
          <Link
            href="/"
            className={getLinkClassName("text-sm font-medium")}
            {...linkDisabledAttrs}
           >
            Inicio
          </Link>
          <Link
            href="/productos"
            className={getLinkClassName("text-sm font-medium")}
            {...linkDisabledAttrs}
          >
            Productos
          </Link>
          <Link
            href="/acerca"
            className={getLinkClassName("text-sm font-medium")}
            {...linkDisabledAttrs}
          >
            Acerca de
          </Link>
          <Link
            href="/contacto"
            className={getLinkClassName("text-sm font-medium")}
            {...linkDisabledAttrs}
          >
            Contacto
          </Link>
          <Link
            href="/host"
            className={getLinkClassName("text-sm font-medium")} // Quitado text-blue-500 para consistencia desktop
            {...linkDisabledAttrs}
           >
            Host
          </Link>
        </nav>

        {/* --- Sección Auth Desktop --- */}
        <div className="hidden md:flex items-center gap-4">
          {showLoggedInView ? (
            // Vista Logueado (Desktop) - Menú Desplegable
            <DropdownMenu>
              <DropdownMenuTrigger asChild {...disabledProps}>
                 {/* Botón que activa el menú de usuario */}
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                     {/* Considerar añadir AvatarImage si se tienen datos */}
                    <AvatarFallback>US</AvatarFallback> {/* TODO: Hacer dinámico */}
                  </Avatar>
                  <span className="text-sm font-medium">Usuario</span> {/* TODO: Hacer dinámico */}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                 {/* Contenido del menú (items también deben respetar disableInteractions indirectamente) */}
                <DropdownMenuItem
                  // onClick={() => { /* TODO: Navegar a perfil */ }}
                  disabled={disableInteractions} // Deshabilitar item directamente
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Mi perfil</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => !disableInteractions && setIsLoggedIn(false)} // Acción solo si no está deshabilitado
                  disabled={disableInteractions} // Deshabilitar item directamente
                 >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // Vista Deslogueado (Desktop) - Botones
            <>
              <Button
                variant="ghost"
                onClick={() => !disableInteractions && setIsLoggedIn(true)} // Acción solo si no está deshabilitado
                {...disabledProps} // Aplicar disabled
              >
                <LogIn className="mr-2 h-4 w-4" />
                Iniciar sesión
              </Button>
              <Button
                variant="default"
                // onClick={() => { /* TODO: Navegar a página de registro */ }}
                {...disabledProps} // Aplicar disabled
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Registrarse
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}