import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';


const CircleProgress = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '25vh' }}>
      <CircularProgress size="6rem" />
    </div>
  );
};

export default CircleProgress;
