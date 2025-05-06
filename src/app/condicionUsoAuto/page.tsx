import CondicionesUsoAutoHome from '@/app/condicionUsoAuto/CondicionesUsoAutoHome';
import { notFound } from 'next/navigation';
import DevueltasRecode from '@/components/recodeComponentes/condicionesDeUsoAuto/condicionesDevueltas/Devueltas_Recode';




export default function Page() {
    const mostrarpagina = true;
    if(!mostrarpagina) {
    return notFound();
    }
    <div>
        <DevueltasRecode></DevueltasRecode>
    </div>
    return <CondicionesUsoAutoHome />;
}