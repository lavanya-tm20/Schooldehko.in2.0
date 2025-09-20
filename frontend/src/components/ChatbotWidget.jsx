import React, { useState } from 'react';
import { Fab, Drawer, Box, IconButton, Typography, TextField, Button, Stack, CircularProgress } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import api from '../services/api';

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]); // {role:'user'|'bot', text:string}
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { role: 'user', text }]);
    setInput('');
    setLoading(true);
    try {
      const { data } = await api.post('/chatbot/message', { message: text });
      const reply = data?.reply || data?.message || 'I am here to help!';
      setMessages((m) => [...m, { role: 'bot', text: reply }]);
    } catch (e) {
      setMessages((m) => [...m, { role: 'bot', text: 'Sorry, I could not process that. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Fab color="primary" aria-label="chat" sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1500 }} onClick={() => setOpen(true)}>
        <ChatIcon />
      </Fab>
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 360, p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="h6">SchoolDekho Assistant</Typography>
            <IconButton onClick={() => setOpen(false)}><CloseIcon /></IconButton>
          </Stack>
          <Box sx={{ flex: 1, overflowY: 'auto', border: '1px solid #eee', borderRadius: 1, p: 1, mb: 1 }}>
            {messages.map((m, idx) => (
              <Box key={idx} sx={{ textAlign: m.role === 'user' ? 'right' : 'left', mb: 1 }}>
                <Typography variant="body2" sx={{ display: 'inline-block', px: 1, py: 0.5, borderRadius: 1, bgcolor: m.role === 'user' ? 'primary.main' : 'grey.200', color: m.role === 'user' ? '#fff' : 'inherit' }}>
                  {m.text}
                </Typography>
              </Box>
            ))}
            {loading && <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}><CircularProgress size={20} /></Box>}
          </Box>
          <Stack direction="row" spacing={1}>
            <TextField fullWidth size="small" placeholder="Ask about schools, fees, loans..." value={input} onChange={(e)=>setInput(e.target.value)} onKeyDown={(e)=>{ if (e.key === 'Enter') sendMessage(); }} />
            <Button variant="contained" onClick={sendMessage} disabled={loading}>Send</Button>
          </Stack>
        </Box>
      </Drawer>
    </>
  );
}
