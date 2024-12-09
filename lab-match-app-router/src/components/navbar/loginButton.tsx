"use client"

import { Avatar, Box, Button, IconButton, Menu, MenuItem } from "@mui/material";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

export const LoginButton: React.FC = () => {
    const { data: session } = useSession();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenuOpen = (event : any) => {
        setAnchorEl(event.currentTarget);
      };
    
      function handleMenuClose(shouldSignOut: boolean = false) {
        setAnchorEl(null);
        if(shouldSignOut) {
          signOut({callbackUrl: '/'})
        }
      };

      return (
        <Box sx={{ marginLeft: 'auto' }}>
        {session ? (
          <>
            <IconButton onClick={handleMenuOpen} sx={{ color: 'white' }}>
              <Avatar alt="Profile Icon" src="/profile-pic-url" />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => handleMenuClose()}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={() => handleMenuClose(true)}>Sign Out</MenuItem>
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
      )
}