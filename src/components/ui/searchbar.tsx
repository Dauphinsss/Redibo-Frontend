"use client";

import React, { useState } from "react";

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = () => {
        console.log("Searching for: ", searchTerm);
    }

    return (
        <div className="search-bar">

            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar autos..."
                className="input"
            />

            <button onClick={handleSearch} className="button">
                Buscar
            </button>
        </div>
    );
};

export default SearchBar;