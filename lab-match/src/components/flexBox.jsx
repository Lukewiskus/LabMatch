// CenteredRow.tsx
import React from 'react';
import { Box } from '@mui/material';

const FlexBox = ({ children, flex_gap="100px", sx = {} }) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="row"
      gap={flex_gap}
      sx={{ width: '100%', height: '100%', ...sx }}
    >
      {children}
    </Box>
  );
};

export default FlexBox;
