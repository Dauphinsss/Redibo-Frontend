import { notFound } from 'next/navigation';
import Home from './home';

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ searchParams }: PageProps) {
  const mostrarpagina = true;
  const resolvedSearchParams = await searchParams;
  const ciudadParma = typeof resolvedSearchParams.ciudad === 'string' ? resolvedSearchParams.ciudad : undefined;
  const fechaInicioParam = typeof resolvedSearchParams.fechaInicio === 'string' ? resolvedSearchParams.fechaInicio : undefined;
  const fechaFinParam = typeof resolvedSearchParams.fechaFin === 'string' ? resolvedSearchParams.fechaFin : undefined;

  const ciudad = ciudadParma ?? 'Cochabamba';
  const fechaInicio = fechaInicioParam ?? new Date().toISOString();
  const fechaFin = fechaFinParam ?? new Date(new Date().setDate(new Date().getDate() + 30)).toISOString();

  if (!mostrarpagina) {
    return notFound();
  }

  return <Home ciudad={ciudad} fechaInicio={fechaInicio} fechaFin={fechaFin} />;
}
