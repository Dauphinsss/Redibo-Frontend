import View from '../components/View';

export default function Page({ params }: { params: Promise<{ id: string }>}) {
  const id = params.then(p => p.id);
  return (
    <View id={Number(id)} />
  );
}
