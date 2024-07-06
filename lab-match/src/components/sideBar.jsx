
"use client";
import { AppBar, Toolbar, Typography, Button, Container, Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Box } from "@mui/material";
import BiotechIcon from '@mui/icons-material/Biotech';
import SchoolIcon from '@mui/icons-material/School';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import ScienceIcon from '@mui/icons-material/Science';
import React from "react";

const drawerWidth = 240;

const Sidebar = ({isOpen, onClose}) => {
  const listItems = [
    { text: 'Saved Institutes', icon: <SchoolIcon /> },
    { text: 'Saved Departments', icon: <ScienceIcon /> },
    { text: 'Saved Labs', icon: <BiotechIcon /> },
    { text: 'Saved Authors', icon: <AutoStoriesIcon /> },
  ];

  return (
    <Drawer
      variant="persistent"
      open={isOpen}
      onClose={onClose}
      sx={{
        display: isOpen ? "block" : "none",
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', top: 64 },
      }
   }
    >
      <Toolbar />
      <div>
        <p style={{color: "red"}}>{isOpen}</p>
        <List>
          {listItems.map((item, index) => (
            <ListItem button key={index}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </div>
    </Drawer>
  );
};

export default Sidebar;
