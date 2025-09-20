import React from 'react';
import { Box } from '@mui/material';

// Animated blue→white gradient with subtle pattern overlay
export default function Background({ children }) {
  return (
    <Box sx={{
      position: 'relative',
      minHeight: '100vh',
      overflowX: 'hidden',
      background: 'linear-gradient(120deg, #e8f1ff 0%, #ffffff 40%, #e6f7ff 100%)',
      '&:before': {
        content: '""',
        position: 'fixed',
        inset: 0,
        background: `radial-gradient(ellipse at 10% 10%, rgba(25,118,210,0.06) 0, transparent 60%),
                     radial-gradient(ellipse at 90% 20%, rgba(0,188,212,0.06) 0, transparent 55%),
                     radial-gradient(ellipse at 30% 90%, rgba(25,118,210,0.05) 0, transparent 60%)`,
        pointerEvents: 'none',
        zIndex: 0
      }
    }}>
      <Box sx={{ position: 'relative', zIndex: 1 }}>{children}</Box>
    </Box>
  );
}
