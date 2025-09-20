import React, { useEffect, useState } from 'react';
import { Typography, Grid, Autocomplete, TextField, Card, CardContent, Alert, Stack, Button, MenuItem } from '@mui/material';
import api from '../services/api';

export default function Policies() {
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [school, setSchool] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ q: '', type: '' });

  const types = ['', 'safety','code_of_conduct','privacy','uniform','admission','fees'];

  const fetchSchools = async (q) => {
    if (!q || q.trim().length < 2) { setSchoolOptions([]); return; }
    setLoadingSchools(true);
    try {
      const { data } = await api.get('/schools', { params: { q, limit: 10 } });
      setSchoolOptions(data.rows || data.schools || []);
    } catch (e) { /* ignore */ } finally { setLoadingSchools(false); }
  };

  const loadPolicies = async (id) => {
    setError('');
    try {
      // if id provided, use per-school endpoint; otherwise use global
      if (id) {
        const { data } = await api.get(`/schools/${id}/policies`);
        const list = data.policies || [];
        setPolicies(list.length ? list : [
          { id: 'demo-sp1', title: 'School Safety', type: 'safety', content: 'Emergency drills, CCTV, verified staff.' }
        ]);
      } else {
        const params = {};
        if (filters.q) params.q = filters.q;
        if (filters.type) params.type = filters.type;
        const { data } = await api.get('/policies', { params });
        const list = data.policies || data.rows || [];
        setPolicies(list.length ? list : [
          { id: 'demo-p1', title: 'Admission Policy', type: 'admission', content: 'Transparent criteria, sibling preference, RTE seats reserved.' },
          { id: 'demo-p2', title: 'Refund Policy', type: 'fees', content: 'Fee refunds before term start minus processing fee.' }
        ]);
      }
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load policies for this school');
    }
  };

  // Load all policies on mount
  useEffect(() => { loadPolicies(); /* eslint-disable-next-line */ }, []);

  return (
    <>
      <Typography variant="h5" sx={{ mb: 2 }}>Policies & Regulations</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <Autocomplete
            loading={loadingSchools}
            options={schoolOptions}
            getOptionLabel={(o) => o?.name ? `${o.name} • ${o.city}, ${o.state}` : ''}
            onInputChange={(_, v) => fetchSchools(v)}
            onChange={(_, v) => { setSchool(v || null); if (v?.id) loadPolicies(v.id); else loadPolicies(); }}
            renderInput={(params) => <TextField {...params} label="Select School" placeholder="Type at least 2 characters" />}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField fullWidth label="Search" value={filters.q} onChange={(e)=>setFilters({ ...filters, q: e.target.value })} />
        </Grid>
        <Grid item xs={12} md={2}>
          <TextField fullWidth select label="Type" value={filters.type} onChange={(e)=>setFilters({ ...filters, type: e.target.value })}>
            {types.map(t => <MenuItem key={t} value={t}>{t || 'All'}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid item xs={12} md={1}>
          <Stack direction="row" spacing={1}>
            <Button variant="contained" onClick={() => loadPolicies(school?.id)}>Search</Button>
            <Button variant="outlined" onClick={() => { setSchool(null); setFilters({ q:'', type:'' }); loadPolicies(); }}>Reset</Button>
          </Stack>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {policies.map((p) => (
          <Grid item xs={12} md={6} key={p.id}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">{p.title}</Typography>
                <Typography variant="body2" color="text.secondary">{String(p.type).replace('_',' ')}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>{(p.content || '').slice(0, 240)}{(p.content || '').length>240?'...':''}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {policies.length === 0 && school && (
          <Grid item xs={12}><Alert severity="info">No policies available for this school.</Alert></Grid>
        )}
        {policies.length === 0 && !school && (
          <Grid item xs={12}><Alert severity="info">No policies available.</Alert></Grid>
        )}
      </Grid>
    </>
  );
}
