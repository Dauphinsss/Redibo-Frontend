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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <header className="border-b">
      <div className=" flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-bold text-xl">
            REDIBO
          </Link>
        </div>

        {/* Mobile menu */}
        <div className="flex md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px] sm:w-[300px]">
              <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
              <nav className="flex flex-col gap-4 mt-6 p-6">
                <Link href="/" className="text-sm font-medium">
                  Inicio
                </Link>
                <Link href="/homeBuscador" className="text-sm font-medium">
                  Buscar
                </Link>
                <Link href="/acerca" className="text-sm font-medium">
                  Acerca de
                </Link>
                <Link href="/contacto" className="text-sm font-medium">
                  Contacto
                </Link>
                <div className="mt-4 border-t pt-4">
                  {isLoggedIn ? (
                    <>
                      <div className="flex items-center gap-2 mb-4">
                        <Avatar className="h-8 w-8">
                          
                          <AvatarFallback>US</AvatarFallback>
                        </Avatar>
                        <div className="text-sm font-medium">Usuario</div>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => setIsLoggedIn(false)}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Cerrar sesión
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="default"
                        className="w-full justify-start mb-2"
                        onClick={() => setIsLoggedIn(true)}
                      >
                        <LogIn className="mr-2 h-4 w-4" />
                        Iniciar sesión
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
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

        {/* Desktop navigation */}
        <nav className="hidden md:flex justify-center items-center gap-6">
          <Link href="/" className="text-sm font-medium">
            Inicio
          </Link>
          <Link href="/homeBuscador" className="text-sm font-medium">
            Buscar
          </Link>
          <Link href="/acerca" className="text-sm font-medium">
            Acerca de
          </Link>
          <Link href="/contacto" className="text-sm font-medium">
            Contacto
          </Link>
        </nav>

        {/* Auth section - desktop */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>US</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">Usuario</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Mi perfil</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsLoggedIn(false)}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" onClick={() => setIsLoggedIn(true)}>
                <LogIn className="mr-2 h-4 w-4" />
                Iniciar sesión
              </Button>
              <Button variant="default">
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
