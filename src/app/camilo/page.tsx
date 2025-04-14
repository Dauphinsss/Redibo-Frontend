import Header from '@/components/ui/Header'
import Autoimag from '@/components/ui/Autoimag'
import InfoPrincipal from '@/components/ui/InfoPrincipal'
import InfoDestacable from '@/components/ui/InfoDestacable'
import DescriHost from '@/components/ui/DescriHost'
import DescripcionAuto from '@/components/ui/DescripcionAuto'
import Reserva from '@/components/ui/Reserva'
import Ubicacion from '@/components/ui/Ubicacion'
import ParamIniciales from '@/components/ui/ParamIniciales'

export default function Page(){
    return(
        <>
            <Header />
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