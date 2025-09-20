import React from 'react';
import { Box } from '@mui/material';

/**
 * Section wrapper with gradient backgrounds, rounded corners, and soft shadows.
 * Usage:
 * <Section gradient="blue" sx={{ mt: 2 }}> ... </Section>
 */
export default function Section({ children, gradient = 'light', sx = {}, ...rest }) {
  const bg = {
    hero: 'linear-gradient(135deg, #1e3a8a 0%, #0ea5e9 100%)',
    light: 'linear-gradient(135deg, #eef3ff 0%, #e0f7ff 35%, #f3e8ff 100%)',
    gray: 'linear-gradient(180deg, #f3f4f6 0%, #f8fafc 100%)',
    scholarships: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
    fundraising: 'linear-gradient(135deg, #d1fae5 0%, #6ee7b7 100%)',
    policies: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
    loans: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)'
  }[gradient] || 'linear-gradient(135deg, #eef3ff 0%, #e0f7ff 35%, #f3e8ff 100%)';

  return (
    <Box sx={{
      borderRadius: 3,
      p: { xs: 2, md: 4 },
      mb: 4,
      background: bg,
      boxShadow: '0 10px 40px rgba(2,6,23,0.08)',
      ...sx
    }} {...rest}>
      {children}
    </Box>
  );
}
