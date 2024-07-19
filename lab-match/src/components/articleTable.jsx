import React from 'react';
import { Box } from '@mui/material';
import ArticleCard from './articleCard';
import Grid from '@mui/material/Grid';

const ArticleTable = ({ articleArray, sx = {} }) => {
  return (
    <Box
      sx={{ width: '100%', height: '100%', ...sx }}
    >
       <Grid container spacing={3}  >
            {articleArray?.map((article, index) => (
            <Grid key={index} item xs={6} sx={{maxWidth: "100px"}}>
                <ArticleCard
                Abstract={article["Abstract"]}
                Authors={article["Authors"]}
                DOI={article["DOI"]}
                DatePublished={article["DatePublished"]}
                Journal={article["Journal"]}
                PubMedId={article["PubMedID"]}
                Title={article["Title"]}
                />
            </Grid>
            ))}
        </Grid>
    </Box>
  );
};

export default ArticleTable;
