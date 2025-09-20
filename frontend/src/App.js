import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import Home from './pages/Home';
import Loans from './pages/Loans';
import MyLoans from './pages/MyLoans';
import Compare from './pages/Compare';
import Scholarships from './pages/Scholarships';
import Alumni from './pages/Alumni';
import Fundraising from './pages/Fundraising';
import Policies from './pages/Policies';
import ChatbotWidget from './components/ChatbotWidget';
import StickyNavbar from './components/StickyNavbar';
import Background from './components/Background';

function App() {
  return (
    <>
      <Background>
        <StickyNavbar />
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
      </Background>
      <ChatbotWidget />
    </>
  );
}

export default App;
