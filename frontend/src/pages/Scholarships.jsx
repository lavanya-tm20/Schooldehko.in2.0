import React, { useEffect, useState } from 'react';
import { Typography, Grid, TextField, MenuItem, Button, Card, CardContent, Stack, Alert, Switch, FormControlLabel, LinearProgress, Chip } from '@mui/material';
import Section from '../components/Section';
import api from '../services/api';

export default function Scholarships() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ q: '', type: '', openOnly: true });

  const types = ['', 'merit', 'need_based', 'sports', 'arts', 'minority', 'government', 'private'];

  const fetchList = async () => {
    setLoading(true);
    setError('');
    try {
      const params = { ...filters };
      params.openOnly = String(filters.openOnly);
      const { data } = await api.get('/scholarships', { params });
      const list = data.rows || data.scholarships || data || [];
      if (!list || list.length === 0) {
        // Fallback demo data
        setItems([
          { id: 'demo-s1', name: 'Merit Excellence Scholarship', provider: 'Govt of India', scholarship_type: 'merit', description: 'Awarded to top performers across boards', application_end_date: new Date().toISOString() },
          { id: 'demo-s2', name: 'Need-Based Support', provider: 'EduCare Trust', scholarship_type: 'need_based', description: 'Supports students from low-income families', application_end_date: new Date().toISOString() },
          { id: 'demo-s3', name: 'Sports Achiever Grant', provider: 'Sports Authority', scholarship_type: 'sports', description: 'For state/national level athletes', application_end_date: new Date().toISOString() }
        ]);
      } else {
        setItems(list);
      }
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load scholarships');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); /* eslint-disable-next-line */ }, []);

  const progressFor = (s) => {
    try {
      const start = new Date(s.application_start_date || Date.now());
      const end = new Date(s.application_end_date || Date.now());
      const now = Date.now();
      const pct = Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
      return isFinite(pct) ? Math.round(pct) : 0;
    } catch {
      return 0;
    }
  };

  return (
    <>
      <Section gradient="scholarships">
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>Scholarships</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={4}>
          <TextField fullWidth label="Search" value={filters.q} onChange={(e)=>setFilters({ ...filters, q: e.target.value })} />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField fullWidth select label="Type" value={filters.type} onChange={(e)=>setFilters({ ...filters, type: e.target.value })}>
            {types.map(t => <MenuItem key={t} value={t}>{t || 'All'}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControlLabel control={<Switch checked={filters.openOnly} onChange={(e)=>setFilters({ ...filters, openOnly: e.target.checked })} />} label="Open Only" />
        </Grid>
        <Grid item xs={12} md={2}>
          <Stack direction="row" spacing={1}>
            <Button variant="contained" onClick={fetchList} disabled={loading}>Search</Button>
            <Button variant="outlined" onClick={()=>{ setFilters({ q:'', type:'', openOnly:true }); fetchList(); }}>Reset</Button>
          </Stack>
        </Grid>
        </Grid>

        <Grid container spacing={2}>
        {items.map((s)=> (
          <Grid item xs={12} md={6} key={s.id}>
            <Card variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden', transition: 'all .18s ease', '&:hover': { transform: 'translateY(-4px) scale(1.01)', boxShadow: '0 10px 40px rgba(2,6,23,0.12)' } }}>
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, flexGrow: 1 }}>{s.name}</Typography>
                  {s.scholarship_type && <Chip size="small" label={String(s.scholarship_type).replace('_',' ')} color="primary" variant="outlined"/>}
                </Stack>
                <Typography variant="body2" color="text.secondary">{s.provider}</Typography>
                <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>{s.description?.slice(0,180)}{s.description?.length>180?'...':''}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>Apply by: {new Date(s.application_end_date).toLocaleDateString()}</Typography>
                <LinearProgress variant="determinate" value={progressFor(s)} sx={{ height: 8, borderRadius: 4 }} />
                <Typography variant="caption" color="text.secondary">Window {progressFor(s)}% elapsed</Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Button size="small" variant="contained">Apply Now</Button>
                  <Button size="small" variant="outlined">Details</Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {!loading && items.length===0 && (
          <Grid item xs={12}><Alert severity="info">No scholarships found.</Alert></Grid>
        )}
        </Grid>
      </Section>
    </>
  );
}
