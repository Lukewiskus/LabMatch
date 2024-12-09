"use client"; // Ensure this is present at the top

import { useStateContext } from '@/context/Context';
import { Box, Grid2, Typography } from '@mui/material';
import React from 'react';
import FlexBox from './flexBox';
import CircleProgress from '@/components/circleProgress'
import AuthorCard from './authorCard';
import Link from 'next/link';

const SearchResults: React.FC = () => {
    const { state, dispatch } = useStateContext();
    
    return (
        <div>
        <FlexBox >
        <Box sx={{ flexGrow: 1, padding: 2, maxWidth: "50%", display: 'flex', justifyContent: 'center' }}>
          <Grid2 container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} justifyContent="center">
          {state.hasInitalSearch && !state.isLoading && state.searchAuthorResults?.length > 0 ? <Box>
              <Typography>Cant find the Principle Invetigator you're looking for? Go here to input their information and add their details to our database</Typography>
              <Link href="/submit-author">here</Link>
            </Box> : <></>}
          {state.searchAuthorResults?.length > 0 ? (
            state.searchAuthorResults?.map((author, index) => (
                <Grid2 key={index} size={{ xs: 4, sm: 4, md: 4 }} sx={{ display: 'flex', justifyContent: 'center' }}>
                <AuthorCard
                    authorId={author.author_id}
                    AuthorName={author.name}
                    HIndex={author.h_index}
                />
                </Grid2>
            )) ): (
              <>
                {state.hasInitalSearch && !state.isLoading ? 
                <>
                  <Typography>No Principle Invetigators found, click the link below to get their information</Typography>
                  <Link href="/submit-author">here</Link>
                </> : <></>}
              </>
            )}
            </Grid2>
            { state.isLoading ? <CircleProgress /> : <></>}
          </Box>
        </FlexBox>
        </div>
    );
};

export default SearchResults;


