import React from 'react';
import { Box, Stack, Typography, Button } from '@mui/material';

export default function Hero({ title, subtitle, actions = [] }) {
  return (
    <Box sx={{
      position: 'relative',
      overflow: 'hidden',
      borderRadius: 3,
      p: { xs: 3, md: 6 },
      mb: 4,
      background: 'linear-gradient(135deg, rgba(25,118,210,0.10), rgba(0,188,212,0.10))',
      border: '1px solid rgba(25,118,210,0.15)'
    }}>
      <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>{title}</Typography>
      <Typography variant="h6" sx={{ color: 'text.secondary', mb: 3 }}>{subtitle}</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        {actions.map((a, idx) => (
          <Button key={idx} size="large" variant={a.variant || 'contained'} onClick={a.onClick}>{a.label}</Button>
        ))}
      </Stack>
    </Box>
  );
}
