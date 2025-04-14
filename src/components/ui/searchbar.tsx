"use client";

import './../../styles/searchbar.css'
import React, { use, useEffect, useState } from "react";
import { FaSearch } from 'react-icons/fa';

var canEliminate = true;

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [savedSearches, setSavedSearches] = useState<string[]>([]);
    const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {
        // Uso de mock objects
        const mockSavedSearches = ["busqueda uno", "toyota dos", "persona tres", "busqueda cuatro",
            "busqueda cinco", "busqueda seis", "busqueda siete", "busqueda ocho", "busqueda nueve",
            "busqueda diez", "busqueda once", "busqueda doce"
        ];
        setSavedSearches(mockSavedSearches);

        const handleClickOutside = (event: MouseEvent) => {
            const searchBar = document.querySelector('.search-bar');

            if (searchBar && !searchBar.contains(event.target as Node) && canEliminate) {
                setIsClicked(false);
            }
            canEliminate = true;
        }
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        }

    }, []);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleClick = () => {
        setIsClicked(true);
    }

    const removeSearch = (index: number) => {
        canEliminate = false;
        const updatedSearches = savedSearches.filter((_, i) => i !== index);
        setSavedSearches(updatedSearches);
    }

    return (
        <div className="search-bar">
            <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                onClick={handleClick}
                placeholder="Buscar..."
                className="input"
            />

            {isClicked && (
                <div className="saved-searches">
                    {savedSearches.length > 0 ? (
                        savedSearches.slice(0, 10).map((search, index) => (
                            <div key={index} className="saved-search-item">
                                <span>{search}</span>
                                <button
                                    className="remove-button"
                                    onClick={() => removeSearch(index)}
                                >
                                    X
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No hay búsquedas guardadas.</p>
                    )}
                </div>
            )}

            <FaSearch className='icon' />
            <button className='search-button'>
                <FaSearch className='search-icon' />
            </button>
        </div>
    );
};

export default SearchBar;