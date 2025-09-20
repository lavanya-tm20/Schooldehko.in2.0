import React from 'react';
import { Box } from '@mui/material';

export default function GlassCard({ children, sx = {}, ...props }) {
  return (
    <Box
      sx={{
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        background: 'rgba(255,255,255,0.15)',
        border: '1px solid rgba(255,255,255,0.35)',
        borderRadius: 3,
        boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
        p: { xs: 2, md: 3 },
        transition: 'transform 200ms ease, box-shadow 200ms ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 14px 40px rgba(0,0,0,0.18)'
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}
