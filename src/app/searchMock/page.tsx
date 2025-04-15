"use client";

import './../../styles/searchMock.css'
import Header from "@/components/ui/Header";
import SearchBar from "@/components/ui/searchbar"; 
import React from 'react';
import { useSearchParams } from 'next/navigation';
import { FaSearch } from "react-icons/fa";

const SearchPage = () => {
    const searchParams = useSearchParams();
    const query = searchParams.get('query');
    
    return (
        <div className="search-result-container">
            <Header />
            <SearchBar />
            <h2 className="search-title">Resultado de la búsqueda: "{query}"</h2>

            { query ? (
                <div className="no-results">
                    <FaSearch className="big-search-icon" />
                    <p>No se ha encontrado el resultado de "{query}"</p>
                    <span className="no-autos">Hubo un error en la entrada o no existe el auto solicitado</span>
                </div>
            ) : (
                <div className="resultados">
                <p>Hubo un error en la búsqueda.</p>
                </div>
            )}
        </div>
    );
};

export default SearchPage;