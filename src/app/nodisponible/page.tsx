"use client";
import Link from 'next/link'
import { useRouter } from 'next/navigation' 
export default function Page(){
    const router = useRouter()
    return(
        <div className="flex h-screen bg-gray-200">
            <div className="bg-white rounded-lg shadow relative max-w-md m-auto">
                <div className="p-6 text-center">
                    <svg className="w-20 h-20 text-yellow-400 mx-auto" fill="none" stroke="currentColor" 
                    viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h3 className="text-xl font-normal text-gray-500 mt-5 mb-6">Ups... lo sentimos, el auto que ha solicitado ya ha sido reservado/tomado. </h3>
                    <button type="button"  
                        className="cursor-pointer text-gray-600 font-semibold bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:ring-cyan-300 border-gray-200 rounded-lg text-base inline-flex items-center px-3 py-2.5 text-center mr-2" 
                        onClick={() => router.back()}>
                        Volver Atrás
                    </button>                    
                    <Link href="/"
                        className="text-gray-50 font-semibold bg-yellow-400 hover:bg-yellow-600 focus:ring-4 focus:ring-yellow-300 border border-gray-200 inline-flex items-center rounded-lg text-base px-3 py-2.5 text-center">
                        Elegir otro auto
                    </Link>
                </div>
            </div>
        </div>
    );
}