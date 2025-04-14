"use client";

import Header from "@/components/ui/Header";
import SearchBar from "@/components/ui/searchbar"; 
import React from 'react';
import { useSearchParams } from 'next/navigation';

const SearchPage = () => {
    const searchParams = useSearchParams();
    const query = searchParams.get('query');
    
    return (
        <div>
            <Header />
            <SearchBar />
            <h1>Resultado de la búsqueda</h1>
            { query ? (
                <p> No se ha encontrado "{query}" en pantalla.</p>
            ) : (
                <p>No se ha realizado ninguna búsqueda.</p>
            )}
        </div>
    );
};

export default SearchPage;