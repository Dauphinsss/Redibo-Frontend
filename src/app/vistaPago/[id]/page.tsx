import { notFound } from 'next/navigation';
import View from '../components/View';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);
  if (isNaN(id) || id <= 0) {
    return notFound();
  }
  return <View id={id} />;
}
