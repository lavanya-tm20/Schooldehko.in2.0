import React, { useEffect, useState } from 'react';
import { Typography, Grid, TextField, Button, Card, CardContent, Stack, Alert } from '@mui/material';
import api from '../services/api';

export default function Fundraising() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({ school_id: '', title: '', description: '', goal_amount: 0, deadline: '' });
  const [filters, setFilters] = useState({ q: '', school_id: '' });

  const fetchList = async () => {
    setLoading(true); setError('');
    try {
      const params = {};
      if (filters.q) params.q = filters.q;
      if (filters.school_id) params.school_id = filters.school_id;
      const { data } = await api.get('/fundraising', { params });
      const list = data.campaigns || [];
      if (!list || list.length === 0) {
        // Fallback demo data
        setItems([
          { id: 'demo-c1', title: 'Library Upgrade', description: 'Add 1000 new books and digital catalog.', goal_amount: 100000, raised_amount: 25000 },
          { id: 'demo-c2', title: 'Playground Renovation', description: 'New turf and safety equipment.', goal_amount: 150000, raised_amount: 40000 }
        ]);
      } else {
        setItems(list);
      }
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load campaigns');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchList(); }, []);

  const createCampaign = async () => {
    setError('');
    try {
      if (!form.school_id || !form.title || !form.goal_amount) throw new Error('School ID, Title and Goal are required');
      await api.post('/fundraising', form);
      setForm({ school_id: '', title: '', description: '', goal_amount: 0, deadline: '' });
      fetchList();
    } catch (e) { setError(e?.response?.data?.message || e.message || 'Failed to create campaign'); }
  };

  return (
    <>
      <Typography variant="h5" sx={{ mb: 2 }}>Fundraising Campaigns</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Typography variant="subtitle1" sx={{ mb: 1 }}>Filters</Typography>
      <Grid container spacing={2} sx={{ mb: 1 }}>
        <Grid item xs={12} md={3}>
          <TextField fullWidth label="Filter by School ID" value={filters.school_id} onChange={(e)=>setFilters({ ...filters, school_id: e.target.value })} />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField fullWidth label="Search" value={filters.q} onChange={(e)=>setFilters({ ...filters, q: e.target.value })} />
        </Grid>
        <Grid item xs={12} md={2}>
          <Stack direction="row" spacing={1}>
            <Button variant="contained" onClick={fetchList} disabled={loading}>Search</Button>
            <Button variant="outlined" onClick={()=>{ setFilters({ q:'', school_id:'' }); fetchList(); }}>Reset</Button>
          </Stack>
        </Grid>
      </Grid>

      <Typography variant="subtitle1" sx={{ mb: 1 }}>Create Campaign</Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={3}>
          <TextField fullWidth label="School ID" value={form.school_id} onChange={(e)=>setForm({ ...form, school_id: e.target.value })} />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField fullWidth label="Title" value={form.title} onChange={(e)=>setForm({ ...form, title: e.target.value })} />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField fullWidth type="number" label="Goal Amount (₹)" value={form.goal_amount} onChange={(e)=>setForm({ ...form, goal_amount: e.target.value })} />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField fullWidth type="date" label="Deadline" InputLabelProps={{ shrink: true }} value={form.deadline} onChange={(e)=>setForm({ ...form, deadline: e.target.value })} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Description" multiline minRows={2} value={form.description} onChange={(e)=>setForm({ ...form, description: e.target.value })} />
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={createCampaign}>Create</Button>
            <Button variant="outlined" onClick={()=>setForm({ school_id: '', title: '', description: '', goal_amount: 0, deadline: '' })}>Reset</Button>
          </Stack>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {items.map((c)=> (
          <Grid item xs={12} md={6} key={c.id}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">{c.title}</Typography>
                <Typography variant="body2" color="text.secondary">Goal: ₹{c.goal_amount} • Raised: ₹{c.raised_amount}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>{c.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {!loading && items.length===0 && (
          <Grid item xs={12}><Alert severity="info">No campaigns yet.</Alert></Grid>
        )}
      </Grid>
    </>
  );
}
