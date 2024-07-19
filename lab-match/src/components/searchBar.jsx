// components/SearchBar.js

import React, { useState } from 'react';
import styles from "@/styles/searchBar.module.css";

const SearchBar = ({setSearchResults, setLoading}) => {
    const [query, setQuery] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true)
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/search?query=${encodeURIComponent(query)}`)
            .then((response) => response.json())
             .then(data => {
                setSearchResults({authors: data})
                setLoading(false)
            })
            .catch((error) => {
                setLoading(false)
                setSearchResults({authors: []})
            });
    };

    const handleChange = (event) => {
        setQuery(event.target.value);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && query != "") {
          handleSubmit(event);
        }
      };

    return (
        <form onSubmit={handleSubmit} className={styles.searchForm}>
            <input
                type="text"
                value={query}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                placeholder="Search..."
                className={styles.searchInput}
                required
            />
            <button type="submit" className={styles.searchButton}>Search</button>
        </form>
    );
};

export default SearchBar;
