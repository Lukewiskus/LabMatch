import { useState } from 'react';
import Link from "next/link";
import FlexBox from "./flexBox";
import MenuIcon from '@mui/icons-material/Menu';
import { useSession, signIn, signOut } from "next-auth/react"
import {
  AppBar, 
  Toolbar,  
  Button, 
  Container,
  Modal,
  Box,
  Typography,
  TextField,
  IconButton,
} from '@mui/material';
import { Google as GoogleIcon, Close as CloseIcon } from '@mui/icons-material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
};

const Navbar = ({toggleDrawer}) => {
  const { data: session } = useSession()

  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = () => {
    console.log({ username, email });
    // Handle login logic here
    handleClose();
  };

  const handleGoogleLogin = () => {
    // Handle Google OAuth login here
    console.log("Continue with Google");
    handleClose();
  };

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
        {session ? <>        <Button sx={{ textDecoration: 'none', color: 'white' }} onClick={handleOpen}>Login</Button>
        </> : <><Typography>Ur Signed in teehee</Typography></>}
      </Toolbar>
      </Container>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="login-modal-title"
        aria-describedby="login-modal-description"
      >
        <Box sx={style}>
          <Box display="flex" justifyContent="space-between">
            <Typography id="login-modal-title" variant="h6" component="h2">
              Login
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <TextField
            label="Username"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
            variant="outlined"
          />

          <TextField
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            variant="outlined"
            type="email"
          />

          <Button
            variant="contained"
            color="secondary"
            startIcon={<GoogleIcon />}
            fullWidth
            onClick={handleGoogleLogin}
            sx={{ mt: 2 }}
          >
            Continue with Google
          </Button>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
            sx={{ mt: 2 }}
          >
            Submit
          </Button>
        </Box>
      </Modal>
     
    </AppBar>
    
  );
};

export { Navbar } ;