"use client"; // Ensure this is a client component

import { StateProvider } from "@/context/Context";
import { ReactNode } from "react";
import { NavBar } from "./navbar";
import "@/styles/Layout.module.css";
import { Box } from "@mui/material";

const ClientWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <StateProvider>
      <Box>
        <NavBar />
        <Box sx={{ marginTop: '96px' }}> 
          {children}
        </Box>
      </Box>
    </StateProvider>
  );
};

export default ClientWrapper;