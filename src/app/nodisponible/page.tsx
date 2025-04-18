import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  import { Button } from "@/components/ui/button"
  import Link from 'next/link'
  
  export default function Page() {
    return (
       <div className="flex h-screen bg-gray-200">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="m-auto">Reservar Auto</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Vehiculo No Disponible</AlertDialogTitle>
            <AlertDialogDescription>            
                <svg className="w-20 h-20 text-yellow-400 mx-auto mt-5" fill="none" stroke="currentColor" 
                viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="block text-xl font-normal text-gray-600 mt-5 mb-6">Ups... lo sentimos, el auto que ha solicitado ya ha sido reservado/tomado. </span>            
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cerrar</AlertDialogCancel>
            <AlertDialogAction><Link href="/">Elegir otro Auto</Link></AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div> 
    )
  }