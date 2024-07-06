import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FlexBox from './flexBox';

const AuthorCard = ({ authorId, AuthorName, HIndex }) => (
  <React.Fragment>
    <Box sx={{ maxWidth: 275, cursor: "pointer" }}>
        <Card>  
            <CardContent>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {AuthorName}
            </Typography>
            <Typography sx={{fontSize: 14 }} color="text.secondary">
                HIndex: {HIndex}
            </Typography>
            </CardContent>
        </Card>
    </Box>
  </React.Fragment>
);

export default AuthorCard;

