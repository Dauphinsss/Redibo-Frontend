import Home from './home';
import { notFound } from 'next/navigation';



export default function Page() {
  const mostrarpagina = true;
if(!mostrarpagina) {
  return notFound();
}

  return <Home />;
}
