"use client"; // Ensure this is present at the top

import Link from "next/link";
import FlexBox from "./flexBox"; // Adjust the path as needed
import { useSession } from "next-auth/react";
import {
  AppBar,
  Toolbar,
  Button,
  Container,
  Typography,
  Box,
} from '@mui/material';

export const NavBar: React.FC = () => {
  const { data: session } = useSession();

  return (
    <AppBar position="fixed" id="navbar" sx={{ backgroundColor: '#1976d2' }}>
      <Container>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left side - Logo / Home Link */}
          <Box sx={{ flexGrow: 1 }}>
            <Link href="/" passHref style={{ textDecoration: 'none' }}>
              <Typography
                sx={{
                  color: 'white',
                  fontSize: '24px',
                  '&:hover': {
                    textDecoration: 'underline', // Optional hover effect
                  }
                }}
                variant="h6"
              >
                Lab Reputation
              </Typography>
            </Link>
          </Box>

          {/* Right side - Session Info */}
          <Box sx={{ marginLeft: 'auto' }}>
            {session ? (
              <Button sx={{ textDecoration: 'none', color: 'white', marginLeft: 2 }}>
                Login
              </Button>
            ) : (
              <Typography sx={{ color: 'white', marginLeft: 2 }}>
                Ur Signed in teehee
              </Typography>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
