// CenteredRow.tsx
"use client"
import React, { useState } from 'react';
import { Navbar } from './navbar';
import Sidebar from './sideBar';
import "@/styles/Layout.module.css";


const LayOut = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleDrawer = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  

  return (
    <div>
      <Navbar toggleDrawer={toggleDrawer} />
      <div className="main-layout">
      <Sidebar isOpen={isSidebarOpen} onClose={toggleDrawer} />
        <div className="content-container ">
          {children}
          <p>{isSidebarOpen}</p>
        </div>
      </div>
    </div>

  )
};

export default LayOut;