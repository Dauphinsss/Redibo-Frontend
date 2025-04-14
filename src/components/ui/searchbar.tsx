"use client";

import './../../styles/searchbar.css'
import React, { useState } from "react";
import { FaSearch } from 'react-icons/fa';

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log("Searching for: ", searchTerm);
    }

    return (
        <div className="search-bar">
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="input"
            />
            <FaSearch className='icon' />
        </div>
    );
};

export default SearchBar;