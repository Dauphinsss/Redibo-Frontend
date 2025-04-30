"use client";

import './../../styles/searchbar.css';
import React, { useRef, useEffect, useState } from "react";
import { FaSearch } from 'react-icons/fa';
import { useRouter, usePathname } from 'next/navigation';

let canClose = true;

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [savedSearches, setSavedSearches] = useState<string[]>([]);
  const [isClicked, setIsClicked] = useState(false);
  const router = useRouter();

  const searchBarRef = useRef<HTMLDivElement>(null);
  const savedSearchesRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const isSearchPage = pathname === "/searchMock";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node) &&
        savedSearchesRef.current && !savedSearchesRef.current.contains(event.target as Node) &&
        canClose) {
        setIsClicked(false);
      }
      canClose = true;
    }

    const restored = sessionStorage.getItem("restoreSearch");
    if (restored && searchTerm === "") {
      setSearchTerm(restored);
    }

    if (searchTerm === "" && isSearchPage) {
      const params = new URLSearchParams(window.location.search);
      params.delete('query');
    }

    const stored = localStorage.getItem("savedSearches");
    if (stored) {
      setSavedSearches(JSON.parse(stored));
    }

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    }

  }, [isSearchPage, searchTerm]);

  const handleButtonClick = () => {
    if (!searchTerm.trim()) return;

    if (searchTerm || !savedSearches.includes(searchTerm.toLowerCase())) {
      const updatedSearches = [searchTerm.toLowerCase(), ...savedSearches.filter(
        s => s.toLowerCase() !== searchTerm.toLowerCase())];
      setSavedSearches(updatedSearches);

      localStorage.setItem("savedSearches", JSON.stringify(updatedSearches));
      sessionStorage.setItem("restoreSearch", searchTerm);
      router.push(`/searchMock?query=${encodeURIComponent(searchTerm)}`);
      setIsClicked(false);
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
    sessionStorage.setItem("restoreSearch", search);
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
        maxLength={50}
        type="text"
        value={searchTerm}
        onChange={(e) => {
          const value = e.target.value;
          setSearchTerm(value);
          sessionStorage.setItem("restoreSearch", value.toLowerCase());
        }
        }
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

      <button className='search-button' onClick={() => handleButtonClick()}>
        <FaSearch className='search-icon' />
      </button>
    </div>
  );
};

export default SearchBar;