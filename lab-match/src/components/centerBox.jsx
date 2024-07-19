import React from 'react';
import { Box } from '@mui/material';

const CenterBox = ({ children, sx = {} }) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="row"
      gap="100px"
      sx={{ width: '100%', height: '100%', ...sx }}
    >
      <div>
        {children}
      </div>
    </Box>
  );
};

export default CenterBox;
