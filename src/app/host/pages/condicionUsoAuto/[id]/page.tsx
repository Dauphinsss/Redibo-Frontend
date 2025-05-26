import CondicionesUsoAutoHome from '@/app/host/pages/condicionUsoAuto/[id]/CondicionesUsoAutoHome';
import { notFound } from 'next/navigation';

export default function Page() {
    const mostrarpagina = true;
    if(!mostrarpagina) {
        return notFound();
    }
    return <CondicionesUsoAutoHome />;
}