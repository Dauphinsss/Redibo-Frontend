import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AvatarExample() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Componente Avatar</h2>

      <div className="flex flex-wrap items-center gap-6">
        
        <div className="flex flex-col items-center gap-2">
          <Avatar>
            <AvatarImage src="/placeholder-user.jpg" alt="Usuario" />
            <AvatarFallback>JP</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">Básico</span>
        </div>

        
        <div className="flex flex-col items-center gap-2">
          <Avatar className="h-12 w-12">
            <AvatarImage src="/placeholder-user.jpg" alt="Usuario" />
            <AvatarFallback>MS</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">Mediano</span>
        </div>

        
        <div className="flex flex-col items-center gap-2">
          <Avatar className="h-16 w-16">
            <AvatarImage src="/placeholder-user.jpg" alt="Usuario" />
            <AvatarFallback>CR</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">Grande</span>
        </div>

        
        <div className="flex flex-col items-center gap-2">
          <Avatar className="h-12 w-12 border-2 border-primary">
            <AvatarImage src="/placeholder-user.jpg" alt="Usuario" />
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">Con borde</span>
        </div>

        
        <div className="flex flex-col items-center gap-2">
          <Avatar className="h-12 w-12 bg-primary">
            <AvatarFallback className="text-primary-foreground">MN</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">Fallback</span>
        </div>
      </div>

      
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Grupo de avatares</h3>
        <div className="flex -space-x-4">
          <Avatar className="border-2 border-background">
            <AvatarImage src="/placeholder-user.jpg" alt="Usuario 1" />
            <AvatarFallback>U1</AvatarFallback>
          </Avatar>
          <Avatar className="border-2 border-background">
            <AvatarImage src="/placeholder-user.jpg" alt="Usuario 2" />
            <AvatarFallback>U2</AvatarFallback>
          </Avatar>
          <Avatar className="border-2 border-background">
            <AvatarImage src="/placeholder-user.jpg" alt="Usuario 3" />
            <AvatarFallback>U3</AvatarFallback>
          </Avatar>
          <Avatar className="border-2 border-background">
            <AvatarFallback className="bg-muted">+5</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  )
}
