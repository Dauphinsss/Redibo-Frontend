"use client"
import dynamic from "next/dynamic";
import { useMemo } from "react";

export default function Page() {
  const Map = useMemo(() => dynamic(
    () => import('@/components/map/'),
    {
      loading: () => <p>A map is loading</p>,
      ssr: false,
    }
  ), []);
  return (
    <>
      <div className="bg-white-700 mx-auto my-5 w-[98%] h-[700px]">
        <Map posix={[4.79029, -75.69003]} />
      </div>
    </>
  )
}