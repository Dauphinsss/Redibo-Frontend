import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from 'next/image';

export default function CardExample() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Componente Card</h2>
      <div className="grid md:grid-cols-2 gap-6">
        
        <Card>
          <CardHeader>
            <CardTitle>Tarjeta básica</CardTitle>
            <CardDescription>Esta es una tarjeta básica con título y descripción</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              El contenido principal de la tarjeta
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancelar</Button>
            <Button>Guardar</Button>
          </CardFooter>
        </Card>

        
        <Card className="overflow-hidden">
          <div className="h-48 w-full">
              <Image
              src="/placeholder.svg"
              alt="Imagen de ejemplo"
              width={400}
              height={200}
              className="h-full w-full object-cover"
              />
          </div>
          <CardHeader>
            <CardTitle>Tarjeta con imagen</CardTitle>
            <CardDescription>Una tarjeta que incluye una imagen en la parte superior</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Contenido de la tarjeta con imagen
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Ver más</Button>
          </CardFooter>
        </Card>

        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" alt="Usuario" />
                <AvatarFallback>JP</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>Juan Pérez</CardTitle>
                <CardDescription>Desarrollador Web</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p>
              Perfil 
            </p>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button>WhatssApp</Button>
          </CardFooter>
        </Card>

        
        <Card className="border-primary">
          <CardHeader className="bg-primary/10">
            <CardTitle>Tarjeta con estilo personalizado</CardTitle>
            <CardDescription>colores y bordes</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p>
              Estilos, colores y bordes
            </p>
          </CardContent>
          <CardFooter className="bg-muted/50">
            <Button variant="outline" className="w-full">
              Acción personalizada
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
