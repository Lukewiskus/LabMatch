import SearchBar from "@/components/searchBar";
import FlexBox from "@/components/flexBox";
import styles from "@/styles/Home.module.css";

import { useState } from "react";

const filterData = (query, data) => {
  if (!query) {
    return data;
  } else {
    return data.filter((d) => d.toLowerCase().includes(query));
  }
};

const data = [
  "Paris",
  "London",
  "New York",
  "Tokyo",
  "Berlin",
  "Buenos Aires",
  "Cairo",
  "Canberra",
  "Rio de Janeiro",
  "Dublin"
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const [searchResults, setSearchResults] = useState({})

  return (
      <div className={styles.homeWrapper}>
        <p>Welcome to LabMatch! Search for the lab that you are thinking of joining and either request for information, or look at the data we already
          collected
        </p>
        <FlexBox >
        <SearchBar setSearchResults={setSearchResults} />
        </FlexBox>
        
        <ul>
          {searchResults?.authors?.map((author, index) => (
            <li key={index}>{author["name"]}, H-Index: {author["h-index"]}</li>
          ))}
        </ul>
        
      </div>
  );
}
