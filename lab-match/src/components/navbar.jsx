"use client";
import Link from "next/link";
import { AppBar, Toolbar, Typography, Button, Container, Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Box, ButtonBase } from "@mui/material";
import FlexBox from "./flexBox";
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = ({toggleDrawer}) => {
  return (
    <AppBar position="fixed" id="navbar">
      <Container>        
      <Toolbar >
      <Button style={{color: 'white'}} onClick={toggleDrawer}>
        <MenuIcon />
      </Button>
        <Link style={{ textDecoration: 'none'}} href="/" passHref>
            <Typography sx={{ textDecoration: 'none', color: 'white' }} variant="h6">LabMatch</Typography>
        </Link>

        <FlexBox />
        {/* <FlexBox>
          <Link href="/institutes" passHref>
            <Button sx={{ textDecoration: 'none', color: 'white' }}>Institutes</Button>
          </Link>
          <Link href="/departments">
          <Button sx={{ textDecoration: 'none', color: 'white' }}>Departments</Button>
          </Link>
          <Link href="/labs" passHref>
            <Button sx={{ textDecoration: 'none', color: 'white' }}>Labs</Button>
          </Link>
          <Link href="/authors">
          <Button sx={{ textDecoration: 'none', color: 'white' }}>Authors</Button>
          </Link>
        </FlexBox> */}
        <Button sx={{ textDecoration: 'none', color: 'white' }}>Login</Button>
      </Toolbar>
      </Container>
     
    </AppBar>
  );
};

export { Navbar } ;