import View from '../components/View';

export default function Page({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  return (
    <View id={id} />
  );
}
