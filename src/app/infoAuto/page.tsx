import RecodeHeader from '@/components/recodeComponentes/RecodeHeader'
import Autoimag from '@/components/recodeComponentes/RecodeAutoimag'
import InfoPrincipal from '@/components/recodeComponentes/RecodeInfoPrincipal'
import InfoDestacable from '@/components/recodeComponentes/RecodeInfoDestacable'
import DescriHost from '@/components/recodeComponentes/RecodeDescriHost'
import DescripcionAuto from '@/components/recodeComponentes/RecodeDescripcionAuto'
import Reserva from '@/components/recodeComponentes/RecodeReserva'
import Ubicacion from '@/components/recodeComponentes/RecodeUbicacion'
import ParamIniciales from '@/components/recodeComponentes/RecodeParamIniciales'

export default function Page(){
    return(
        <>
            <RecodeHeader />
            <main className="w-full flex flex-col items-center px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-6xl border-b-gray-300 py-4">
                    <ParamIniciales />
                </div>

                <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 py-6">
                    <div>
                        <Autoimag />
                        <InfoPrincipal />
                        <DescripcionAuto />
                        <DescriHost />
                    </div>
                    <div className="lg:w-1/3">
                        <div className="sticky top-4 flex flex-col gap-4">
                        <InfoDestacable />
                        <Reserva />
                        </div>
                    </div>
                </div>
                <div className="w-full max-w-6xl border-t border-gray-300 lg:hidden py-4">
                    <Ubicacion />
                </div>
            </main>
        </>
    )
}