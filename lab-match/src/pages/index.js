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
import CircleProgress from "@/components/circleProgress";
import Link from "next/link";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function Home() {
  const [searchResults, setSearchResults] = useState({})
  const [loading, setLoading] = useState(false);

  return (
      <div className={styles.homeWrapper}>
        <Typography variant="h6" sx={{ textAlign: 'center', marginBottom: '16px', marginTop: '16px' }}>
          Welcome to LabMatch! Search for the name of the Principal Investigator to see the informamation of their Lab collected
        </Typography >
        <FlexBox >
          <SearchBar setSearchResults={setSearchResults} setLoading={setLoading} />
        </FlexBox>
        <FlexBox />
        <FlexBox >
          <Box sx={{ flexGrow: 1, padding: 2, maxWidth:"50%" }}>
            <Grid container spacing={3}  >
              {searchResults?.authors?.map((author, index) => (
                <Grid key={index} item xs={6} sx={{maxWidth: "100px"}}>
                  <AuthorCard
                    authorId={author["authorId"]}
                    AuthorName={author["name"]}
                    HIndex={author["h_index"]}
                  />
                </Grid>
              ))}
            </Grid>
            { loading ? <CircleProgress /> : <></>}
          </Box>
        </FlexBox>
        { searchResults?.authors != undefined ? 
              <Typography>
              Can&apos;t find who you&apos;re looking for? Enter their name
              <Link href="/submitAuthor" passHref>
                <p style={{ color: 'blue', textDecoration: 'underline' }}>here</p>
              </Link>
              and we will collect their publication data for you.
            </Typography> : <></> }
      </div>
  );
}
