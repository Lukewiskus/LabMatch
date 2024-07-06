// components/SearchBar.js

import React, { useState } from 'react';
import styles from "@/styles/searchBar.module.css";

const SearchBar = ({setSearchResults}) => {
    const [query, setQuery] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/search?query=${encodeURIComponent(query)}`)
            .then((response) => response.json())
             .then(data => {
                console.log(data)
                setSearchResults({authors: data})
            })
            .catch((error) => {
            console.error('Error fetching data:', error);
            });
    };

    const handleChange = (event) => {
        setQuery(event.target.value);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
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
            />
            <button type="submit" className={styles.searchButton}>Search</button>
        </form>
    );
};

export default SearchBar;
