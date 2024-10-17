import React, { ReactNode } from 'react';
import { Box, SxProps, Theme } from '@mui/material';

interface FlexBoxProps {
  children?: ReactNode;
  flex_gap?: string;
  sx?: SxProps<Theme>;
}

const FlexBox: React.FC<FlexBoxProps> = ({ children, flex_gap = "100px", sx = {} }) => {
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
