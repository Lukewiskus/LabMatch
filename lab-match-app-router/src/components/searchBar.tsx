"use client"; // Ensure this is present at the top

import React, { useState } from 'react';
import { useStateContext } from '@/context/Context'; // Adjust the path as needed
import styles from "@/styles/searchBar.module.css";
import { SearchAuthorResults } from '@/interfaces/searchAuthorResults';

const SearchBar: React.FC = () => {
  const { dispatch } = useStateContext();
  const [query, setQuery] = useState('');

  const searchResults = async () => {
    return await fetch(`api/get/authors?query=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        const authors: SearchAuthorResults[] = data.map((item: any) => ({
          affiliation: item.affiliation,
          author_id: item.author_id,
          create_date_utc: item.create_date_utc,
          email: item.email,
          google_cites_per_year: item.google_cites_per_year,
          google_h_index: item.google_h_index,
          google_h_index5y: item.google_h_index5y,
          google_homepage: item.google_homepage,
          google_i_index: item.google_i_index,
          google_i_index5y: item.google_i_index5y,
          google_scholar_id: item.google_scholar_id,
          h_index: item.h_index,
          lab_id: item.lab_id,
          last_modified_date_utc: item.last_modified_date_utc,
          name: item.name,
        }));
        dispatch({ type: 'SET-SEARCH-AUTHORS', payload: { searchResults: authors } });
        dispatch({ type: 'LOADING', payload: { isLoading: false } });
      })
      .catch(() => {
        dispatch({ type: 'SET-SEARCH-AUTHORS', payload: { searchResults: [] } });
        dispatch({ type: 'LOADING', payload: { isLoading: false } });
      })
  }
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch({ type: 'LOADING', payload: { isLoading: true } });
    searchResults()
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query != "") {
        handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
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
