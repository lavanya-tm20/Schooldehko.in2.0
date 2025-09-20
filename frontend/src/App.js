import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Button, Stack } from '@mui/material';
import Home from './pages/Home';
import Loans from './pages/Loans';
import MyLoans from './pages/MyLoans';
import Compare from './pages/Compare';
import LanguageSwitcher from './components/LanguageSwitcher';
import Scholarships from './pages/Scholarships';
import Alumni from './pages/Alumni';
import Fundraising from './pages/Fundraising';
import Policies from './pages/Policies';
import ChatbotWidget from './components/ChatbotWidget';

function App() {
  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            SchoolDekho.in
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/compare">Compare</Button>
            <Button color="inherit" component={Link} to="/loans">Loans</Button>
            <Button color="inherit" component={Link} to="/my-loans">My Loans</Button>
            <Button color="inherit" component={Link} to="/scholarships">Scholarships</Button>
            <Button color="inherit" component={Link} to="/alumni">Alumni</Button>
            <Button color="inherit" component={Link} to="/fundraising">Fundraising</Button>
            <Button color="inherit" component={Link} to="/policies">Policies</Button>
            <LanguageSwitcher />
          </Stack>
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 4 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/loans" element={<Loans />} />
          <Route path="/my-loans" element={<MyLoans />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/scholarships" element={<Scholarships />} />
          <Route path="/alumni" element={<Alumni />} />
          <Route path="/fundraising" element={<Fundraising />} />
          <Route path="/policies" element={<Policies />} />
        </Routes>
      </Container>
      <ChatbotWidget />
    </>
  );
}

export default App;
