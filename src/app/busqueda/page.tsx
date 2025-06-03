import { notFound } from 'next/navigation';
import Home from './home';

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ searchParams }: PageProps) {
  const mostrarpagina = true;
  const resolvedSearchParams = await searchParams;
  const ciudad = typeof resolvedSearchParams.ciudad === 'string' ? resolvedSearchParams.ciudad : undefined;

  if (!mostrarpagina) {
    return notFound();
  }

  // Calcular las fechas
  const fechaInicio = new Date().toISOString(); // Fecha actual
  const fechaFin = new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(); // Fecha 30 días después

  return <Home ciudad={ciudad} fechaInicio={fechaInicio} fechaFin={fechaFin} />;
}
