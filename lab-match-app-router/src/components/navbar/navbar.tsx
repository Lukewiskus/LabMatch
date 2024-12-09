import Link from "next/link";
import {
  AppBar,
  Toolbar,
  Container,
  Typography,
  Box
} from '@mui/material';
import { LoginButton } from "./loginButton";

export const NavBar: React.FC = () => {
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
                    textDecoration: 'underline',
                  }
                }}
                variant="h1"
              >
                Lab Reputation
              </Typography>
            </Link>
          </Box>
          {/* Right side - Session Info */}
         <LoginButton />
        </Toolbar>
      </Container>
    </AppBar>
  );
};
