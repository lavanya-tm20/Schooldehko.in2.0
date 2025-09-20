import React from 'react';
import { AppBar, Toolbar, Typography, Stack, Button, Container } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

export default function StickyNavbar() {
  const { pathname } = useLocation();
  const link = (to, label) => (
    <Button
      key={to}
      color="inherit"
      component={Link}
      to={to}
      sx={{
        position: 'relative',
        '&:after': {
          content: '""',
          position: 'absolute',
          left: 12,
          right: 12,
          bottom: 6,
          height: 2,
          bgcolor: 'secondary.main',
          transform: pathname === to ? 'scaleX(1)' : 'scaleX(0)',
          transformOrigin: 'left',
          transition: 'transform .2s ease'
        },
        '&:hover:after': { transform: 'scaleX(1)' }
      }}
    >
      {label}
    </Button>
  );

  return (
    <AppBar elevation={0} position="sticky" color="transparent" sx={{ backdropFilter: 'saturate(180%) blur(8px)', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ py: 1 }}>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 800, color: 'primary.main' }}>
            SchoolDekho.in
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            {link('/', 'Home')}
            {link('/compare', 'Compare')}
            {link('/loans', 'Loans')}
            {link('/my-loans', 'My Loans')}
            {link('/scholarships', 'Scholarships')}
            {link('/alumni', 'Alumni')}
            {link('/fundraising', 'Fundraising')}
            {link('/policies', 'Policies')}
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
