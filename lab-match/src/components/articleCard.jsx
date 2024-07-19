import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const ArticleCard = ({ Abstract, Authors, DOI, DatePublished, Journal, PubMedId, Title }) => {
    const [abstractExpanded, setAbstractExpanded] = React.useState(false);
    const [authorsExpanded, setAuthorsExpanded] = React.useState(false);

    const handleClick = (PubMedId) => {
        const url = `https://pubmed.ncbi.nlm.nih.gov/${PubMedId}`;
        window.open(url, '_blank').focus();
    };

    const handleAbstractExpandClick = (e) => {
        e.stopPropagation(); // Prevent triggering the card's onClick event
        setAbstractExpanded(!abstractExpanded);
    };

    const handleAuthorsExpandClick = (e) => {
        e.stopPropagation(); // Prevent triggering the card's onClick event
        setAuthorsExpanded(!authorsExpanded);
    };

    return (
        <Box
            sx={{
                maxWidth: 400,
                margin: 'auto',
                cursor: 'pointer',
                marginTop: 2,
                boxShadow: 3,
                borderRadius: 2,
                transition: 'transform 0.3s',
                '&:hover': {
                    transform: 'scale(1.05)',
                },
            }}
            onClick={() => handleClick(PubMedId)}
        >
            <Card>
                <CardContent>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {Title}
                    </Typography>
                    <Typography sx={{ mb: 1 }} color="text.secondary">
                        <strong>Journal:</strong> {Journal}
                    </Typography>
                    <Typography sx={{ mb: 1 }} color="text.secondary">
                        <strong>Date Published:</strong> {DatePublished}
                    </Typography>
                    <Typography sx={{ mb: 1 }} color="text.secondary">
                        <strong>DOI:</strong> {DOI}
                    </Typography>
                    <Typography sx={{ mb: 1 }} color="text.secondary">
                        <strong>Authors:</strong> {authorsExpanded ? Authors : `${Authors.substring(0, 50)}...`}
                        {Authors.length > 50 && (
                            <Button size="small" onClick={handleAuthorsExpandClick}>
                                {authorsExpanded ? 'Show Less' : 'Show More'}
                            </Button>
                        )}
                    </Typography>
                    <Typography sx={{ mb: 1 }} color="text.secondary">
                        <strong>Abstract:</strong> {abstractExpanded ? Abstract : `${Abstract.substring(0, 100)}...`}
                        {Abstract.length > 100 && (
                            <Button size="small" onClick={handleAbstractExpandClick}>
                                {abstractExpanded ? 'Show Less' : 'Show More'}
                            </Button>
                        )}
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default ArticleCard;
