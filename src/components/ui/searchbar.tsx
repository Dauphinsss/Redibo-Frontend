"use client";

import './../../styles/searchbar.css'; 
import React, { useRef, useEffect, useState } from "react";
import { FaSearch } from 'react-icons/fa';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

var canClose = true;

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [savedSearches, setSavedSearches] = useState<string[]>([]);
    const [isClicked, setIsClicked] = useState(false);
    const router = useRouter();

    const searchBarRef = useRef<HTMLDivElement>(null);
    const savedSearchesRef = useRef<HTMLDivElement>(null);

    const pathname = usePathname();
    const searchParams = useSearchParams();
    const query = searchParams.get('query');
    const isSearchPage = pathname === "/searchMock";
    const hasSetQuery = useRef(false);

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

        if(isSearchPage && query && !hasSetQuery.current) {
            setSearchTerm(query);
            hasSetQuery.current = true;
        }

        const stored = localStorage.getItem("savedSearches");
        if (stored) {
            setSavedSearches(JSON.parse(stored));
        }

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        }

    }, [isSearchPage, query]);

    const handleButtonClick = () => {
        if (searchTerm && !savedSearches.includes(searchTerm)) {
            const updatedSearches = [searchTerm, ...savedSearches.slice(0, 9)];
            setSavedSearches(updatedSearches);
            
            localStorage.setItem("savedSearches", JSON.stringify(updatedSearches));
            router.push(`/searchMock?query=${encodeURIComponent(searchTerm)}`);
            setIsClicked(false);
        } else if (searchTerm) {
            handleSearchItemClick(searchTerm);
        }
    }

    const handleClick = () => {
        setIsClicked(true);
    }

    const removeSearch = (index: number, event: React.MouseEvent) => {
        event.stopPropagation();
        canClose = false;
        const updatedSearches = savedSearches.filter((_, i) => i !== index);
        setSavedSearches(updatedSearches);
        localStorage.setItem("savedSearches", JSON.stringify(updatedSearches));
    }

    const handleSearchItemClick = (search: string) => {
        setSearchTerm(search);
        setIsClicked(false);

        const updatedSearches = [search, ...savedSearches.filter(item => item !== search)]
        setSavedSearches(updatedSearches);
        localStorage.setItem("savedSearches", JSON.stringify(updatedSearches));
        router.push(`/searchMock?query=${encodeURIComponent(search)}`);
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleButtonClick();
        }
        if (event.key === "Escape") {
            setIsClicked(false);
        }
    }

    return (
        <div className="search-bar" ref={searchBarRef}>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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