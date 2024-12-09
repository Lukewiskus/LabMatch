"use client"; 


import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';

interface AuthorCardProps {
  authorId: number; // or string, depending on your author ID type
  AuthorName: string;
  HIndex: number; // or string if it can be non-numeric
}

const AuthorCard: React.FC<{ authorId: number; AuthorName: string; HIndex: number; }> = ({ authorId, AuthorName, HIndex }) => {
    const router = useRouter();

    const handleAuthorClick = (id: number) => {
        router.push(`/author/${id}`);
    };

    return (
        <Box
            sx={{ 
                width: '100%', // Take full width of the grid item
                cursor: "pointer",
                '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                },
                transition: 'transform 0.2s, box-shadow 0.2s',
            }} 
            onClick={() => handleAuthorClick(authorId)}
        >
            <Card sx={{ height: '100%' }}> {/* Ensure the card takes full height of the Box */}
                <CardContent>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        {AuthorName}
                    </Typography>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary">
                        HIndex: {HIndex}
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};


export default AuthorCard;
