"use client";

import { useState , useEffect} from "react";
import { useRouter } from "next/navigation";
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
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Header() {
  const [user, setUser] = useState<{ nombre: string; foto: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const nombre = localStorage.getItem("nombre");
    const foto = localStorage.getItem("foto");
    if (nombre && foto) {
      setUser({ nombre, foto });
    } else {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    router.push("/");
  };


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
                <Link href="/productos" className="text-sm font-medium">
                  Productos
                </Link>
                <Link href="/acerca" className="text-sm font-medium">
                  Acerca de
                </Link>
                <Link href="/contacto" className="text-sm font-medium">
                  Contacto
                </Link>
                <div className="mt-4 border-t pt-4">
                {user ? (
                    <>
                      <Link href="/perfil">
                        <div className="flex items-center gap-2 mb-4 hover:bg-accent hover:text-accent-foreground rounded-md p-2 cursor-pointer">
                          <Avatar className="h-8 w-8">
                            {user.foto && user.foto !== "default.jpg" ? (
                              <img src={user.foto} alt={user.nombre} className="h-8 w-8 rounded-full" />
                            ) : (
                              <AvatarFallback>{user.nombre.charAt(0)}</AvatarFallback>
                            )}
                          </Avatar>
                          <div className="text-sm font-medium">{user.nombre}</div>
                        </div>
                      </Link>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Cerrar sesión
                      </Button>
                    </>
                  ) : (
                    <>
                      
                      <Link href="/login">
                        <Button
                          variant="default"
                          className="w-full justify-start mb-2"
                        >
                          <LogIn className="mr-2 h-4 w-4" />
                          Iniciar sesión
                        </Button>
                      </Link>
                      <Link href="/registro">
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <UserPlus className="mr-2 h-4 w-4" />
                          Registrarse
                        </Button>
                      </Link>
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
          <Link href="/productos" className="text-sm font-medium">
            Productos
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
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                      {user.foto && user.foto !== "default.jpg" ? (
                        <img src={user.foto} alt={user.nombre} className="h-8 w-8 rounded-full" />
                      ) : (
                        <AvatarFallback>{user.nombre.charAt(0)}</AvatarFallback>
                      )}
                  </Avatar>
                  <span className="text-sm font-medium">{user.nombre}</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <Link href="/perfil">
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Mi perfil</span>
                    </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium">
                Iniciar Sesion
              </Link>
              <Link href="/registro" className="text-sm font-medium">
                <Button variant="default">Registrarse</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
