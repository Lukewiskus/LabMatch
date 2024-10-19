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
  IconButton,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import { useState } from "react";
import { signIn } from 'next-auth/react';

export const NavBar: React.FC = () => {
  const { data: session } = useSession();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event : any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
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
            <>
              <IconButton onClick={handleMenuOpen} sx={{ color: 'white' }}>
                <Avatar alt="Profile Icon" src="/profile-pic-url" />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem onClick={handleMenuClose}>Sign Out</MenuItem>
                </Menu>
                </>
              ) : (
                <Button
                  sx={{ textDecoration: 'none', color: 'white', marginLeft: 2 }}
                    onClick={() => signIn()}
                  >
                    Login
                  </Button>
              )}
              </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
