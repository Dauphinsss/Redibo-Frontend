"use client";

import { useState } from "react";
import Link from "next/link";
import { /*Menu, User,*/ LogOut, ChevronDown, History, Star /*,Users*/ } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
/*import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";*/

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Usuario logueado
  const [openDropdown, setOpenDropdown] = useState(true); // Dropdown abierto automáticamente

  return (
    <header className="border-b">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="font-bold text-xl">REDIBO</Link>

        {/* Menú Desktop (solo Inicio visible) */}
        <nav className="hidden md:flex justify-center items-center gap-6">
          <Link href="/" className="text-sm font-medium">Inicio</Link>
        </nav>
        <nav className="hidden md:flex justify-center items-center gap-6">
          <Link href="/" className="text-sm font-medium text-gray-400" style={{ pointerEvents: 'none', opacity: 0.5 }}>Productos</Link>
        </nav>
        <nav className="hidden md:flex justify-center items-center gap-6">
          <Link href="/" className="text-sm font-medium text-gray-400" style={{ pointerEvents: 'none', opacity: 0.5 }}>Acerca De</Link>
        </nav>
        <nav className="hidden md:flex justify-center items-center gap-6">
          <Link href="/" className="text-sm font-medium text-gray-400" style={{ pointerEvents: 'none', opacity: 0.5 }}>Contacto</Link>
        </nav>

        {/* Dropdown de usuario logueado */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn && (
            <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>US</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">Diana Vargas</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">

                <DropdownMenuItem asChild>
                  <Link href="/historia3">
                    <Star className="mr-2 h-4 w-4" />
                    <span>Calificar Renters</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/historia4">
                    <History className="mr-2 h-4 w-4" />
                    <span>Actividad de Automobil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsLoggedIn(false)} style={{ pointerEvents: 'none', opacity: 0.5 }}className="text-gray-400">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
