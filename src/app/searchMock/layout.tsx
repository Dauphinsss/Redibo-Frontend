import { Suspense } from "react"

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>Cargando búsqueda...</div>}>
      {children}
    </Suspense>
  )
}