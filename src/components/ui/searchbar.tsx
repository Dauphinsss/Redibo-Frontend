"use client";

import './../../styles/searchbar.css'; 
import React, { useRef, useEffect, useState } from "react";
import { FaSearch } from 'react-icons/fa';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

var canClose = true;
const userId = 22;

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [savedSearches, setSavedSearches] = useState<{ id: number, criterio: string }[]>([]);
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

        fetch(`http://localhost:4000/api/search-history/id/${userId}`)
            .then(res => res.json())
            .then(data => setSavedSearches(data))
            .catch(err => console.error("Error al cargar búsquedas:" , err))

        const restored = localStorage.getItem("restoreSearch");
        if (restored && searchTerm === "") {
            setSearchTerm(restored);
            localStorage.removeItem("restoreSearch");
        }

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        }

    }, [isSearchPage, query]);

    const handleButtonClick = () => {
        const normalized = searchTerm.trim().toLowerCase();
        const alreadyExists = savedSearches.map(s => s.criterio.trim().toLowerCase()).includes(normalized);

        if (searchTerm && !alreadyExists) {
            localStorage.setItem("lastSearchTerm", searchTerm);
            fetch("http://localhost:4000/api/search-history/save", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  criterio: searchTerm,
                  id_usuario: userId
                })
              })
              .then(res => res.json())
              .then(data => {
                const updatedSearches = [data, ...savedSearches];
                setSavedSearches(updatedSearches);
              })
              .catch(err => console.error("Error al guardar búsqueda: ", err));

            router.push(`/searchMock?query=${encodeURIComponent(searchTerm)}`);
            setIsClicked(false);
        } else if (searchTerm) {
            handleSearchItemClick(searchTerm);
        }
    };

    const handleClick = () => {
        setIsClicked(true);
    };

    const removeSearch = (id: number, index: number, event: React.MouseEvent) => {
        event.stopPropagation();
        canClose = false;
        const updatedSearches = savedSearches.filter((_, i) => i !== index);
        setSavedSearches(updatedSearches);

        fetch(`http://localhost:4000/api/search-history/delete/${id}`, {
            method: "DELETE"
        });
    };

    const handleSearchItemClick = (search: string) => {
        const normalizedSearch = search.trim().toLowerCase();
        const updatedSearches = [
            { id: Date.now(), criterio: search },
            ...savedSearches.filter(item => item.criterio.trim().toLowerCase() !== normalizedSearch)
          ];
        setSearchTerm(search);
        setSavedSearches(updatedSearches);
        setIsClicked(false);
    
        localStorage.setItem("lastSearchTerm", search);
        router.push(`/searchMock?query=${encodeURIComponent(search)}`);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleButtonClick();
        }
        if (event.key === "Escape") {
            setIsClicked(false);
        }
    };

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
                            <div key={index} className="saved-search-item" onClick={() => handleSearchItemClick(search.criterio)}>
                                <span>{search.criterio}</span>
                                <button
                                    className="remove-button"
                                    onClick={(e) => removeSearch(search.id, index, e)}
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