// CenteredRow.tsx
import React from 'react';
import { Box } from '@mui/material';

const FlexBox = ({ children }) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="row"
      gap="100px"
      sx={{ width: '100%', height: '100%' }}
    >
      {children}
    </Box>
  );
};

export default FlexBox;
