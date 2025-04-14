"use client";

import './../../styles/searchbar.css'
import React, { useRef, useEffect, useState } from "react";
import { FaSearch } from 'react-icons/fa';

var canClose = true;

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [savedSearches, setSavedSearches] = useState<string[]>([]);
    const [isClicked, setIsClicked] = useState(false);

    const searchBarRef = useRef<HTMLDivElement>(null);
    const savedSearchesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Uso de mock objects
        const mockSavedSearches = ["busqueda uno", "toyota dos", "persona tres", "busqueda cuatro",
            "busqueda cinco", "busqueda seis", "busqueda siete", "busqueda ocho", "busqueda nueve",
            "busqueda diez", "busqueda once", "busqueda doce"
        ];
        setSavedSearches(mockSavedSearches);

        const handleClickOutside = (event: MouseEvent) => {
            if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node) && 
                savedSearchesRef.current && !savedSearchesRef.current.contains(event.target as Node) &&
                canClose) {
                setIsClicked(false);
            }
            canClose = true;
        }

        const handleKeyboard = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsClicked(false);
            }
            if (event.key === "Enter") {
                handleButtonClick();
            }
        }

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        }

    }, []);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleButtonClick = () => {
        if (searchTerm && !savedSearches.includes(searchTerm)) {
            const updatedSearches = [searchTerm, ...savedSearches.slice(0, 9)];
            setSavedSearches(updatedSearches);
        } else if (searchTerm) {
            handleSearchItemClick(searchTerm);
        }
        setIsClicked(false);
    }

    const handleClick = () => {
        setIsClicked(true);
    }

    const removeSearch = (index: number, event: React.MouseEvent) => {
        event.stopPropagation();
        canClose = false;
        const updatedSearches = savedSearches.filter((_, i) => i !== index);
        setSavedSearches(updatedSearches);
    }

    const handleSearchItemClick = (search: string) => {
        setSearchTerm(search);
        setIsClicked(false);

        const updatedSearches = [search, ...savedSearches.filter(item => item !== search)]
        setSavedSearches(updatedSearches);
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleButtonClick();
        }
    }

    return (
        <div className="search-bar" ref={searchBarRef}>
            <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                placeholder="Buscar..."
                className="input"
            />

            {isClicked && (
                <div className="saved-searches" ref={savedSearchesRef}>
                    {savedSearches.length > 0 ? (
                        savedSearches.slice(0, 10).map((search, index) => (
                            <div key={index} className="saved-search-item" onClick={() => handleSearchItemClick(search)}>
                                <span>{search}</span>
                                <button
                                    className="remove-button"
                                    onClick={(e) => removeSearch(index, e)}
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
            <button className='search-button' onClick={() => handleButtonClick()}>
                <FaSearch className='search-icon' />
            </button>
        </div>
    );
};

export default SearchBar;