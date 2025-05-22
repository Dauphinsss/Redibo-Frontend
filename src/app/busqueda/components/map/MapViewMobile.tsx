import { useState } from "react";
import BotonMapaMovil from "./BotonMapaMobile";
import TopBarMobile from "./TopBarMobile";

export default function MapViwMobile({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  const [showMap, setShowMap] = useState(false);
  return (
    <>
      <BotonMapaMovil onClick={() => setShowMap(true)} />

      {
        showMap && (
          <div className="fixed inset-0 bg-white bg-opacity-70 z-[9999] flex items-center justify-center lg:hidden">
            <div className="relative w-full h-full bg-white rounded-t-xl overflow-hidden">

              <TopBarMobile
                onClick={() => setShowMap(false)}
              />

              <div className="w-full h-[calc(100%-40px)]">
                {children}
              </div>
            </div>
          </div>
        )
      }
    </>
  )
}