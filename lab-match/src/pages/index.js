import SearchBar from "@/components/searchBar";
import FlexBox from "@/components/flexBox";
import AuthorCard from "@/components/authorCard"
import styles from "@/styles/Home.module.css";
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { useState } from "react";
import { Typography } from "@mui/material";

const filterData = (query, data) => {
  if (!query) {
    return data;
  } else {
    return data.filter((d) => d.toLowerCase().includes(query));
  }
};

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function Home() {
  const [searchResults, setSearchResults] = useState({})

  return (
      <div className={styles.homeWrapper}>
        <p>Welcome to LabMatch! Search for the lab that you are thinking of joining and either request for information, or look at the data we already
          collected
        </p>
        <FlexBox >
        <SearchBar setSearchResults={setSearchResults} />
        </FlexBox>
        <FlexBox>
        <Typography>
          Dont see the researcher you&apos;re looking for? Enter their name here and we will collect their publication data for you
        </Typography>
        </FlexBox>
        <FlexBox >
          <Box sx={{ flexGrow: 1, padding: 2, maxWidth:"50%" }}>
            <Grid container spacing={3}  >
              {searchResults?.authors?.map((author, index) => (
                <Grid key={index} item xs={6} sx={{maxWidth: "100px"}}>
                  <AuthorCard
                    authorId={author["authorId"]}
                    AuthorName={author["name"]}
                    HIndex={author["h-index"]}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </FlexBox>
      </div>
  );
}
