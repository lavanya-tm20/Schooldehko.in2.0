import React, { useState } from 'react';
import { Grid, Typography, Autocomplete, TextField, Card, CardContent, Divider, Button, Alert, Stack } from '@mui/material';
import api from '../services/api';

export default function Compare() {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [schoolA, setSchoolA] = useState(null);
  const [schoolB, setSchoolB] = useState(null);
  const [savedMsg, setSavedMsg] = useState('');
  const [error, setError] = useState('');

  const fetchSchools = async (q) => {
    if (!q || q.trim().length < 2) { setOptions([]); return; }
    setLoading(true);
    try {
      const { data } = await api.get('/schools', { params: { q, limit: 10 } });
      setOptions(data.rows || data.schools || []);
    } catch (e) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const renderCard = (s) => {
    if (!s) return <Typography variant="body2" color="text.secondary">Select a school</Typography>;
    return (
      <Card variant="outlined" sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>{s.name}</Typography>
          <Typography variant="body2">{s.city}, {s.state}</Typography>
          <Typography variant="body2">Board: {s.board} • Type: {s.school_type}</Typography>
          <Typography variant="body2">Rating: {s.rating} ({s.total_reviews} reviews)</Typography>
          <Divider sx={{ my: 1 }} />
          <Typography variant="subtitle2">Fees</Typography>
          <Typography variant="body2">Admission: ₹{s?.fees?.admission_fee || 0}</Typography>
          <Typography variant="body2">Annual: ₹{s?.fees?.annual_fee || 0}</Typography>
          <Typography variant="body2">Monthly: ₹{s?.fees?.monthly_fee || 0}</Typography>
        </CardContent>
      </Card>
    );
  };

  const saveComparison = async () => {
    setSavedMsg('');
    setError('');
    try {
      if (!schoolA || !schoolB) throw new Error('Select two schools first.');
      const { data } = await api.post('/comparison', { schoolIds: [schoolA.id, schoolB.id] });
      setSavedMsg('Comparison saved. You can revisit it from your history later.');
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Failed to save comparison.');
    }
  };

  return (
    <>
      <Typography variant="h5" sx={{ mb: 2 }}>Compare Schools</Typography>
      {savedMsg && <Alert severity="success" sx={{ mb: 2 }}>{savedMsg}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Autocomplete
            loading={loading}
            options={options}
            getOptionLabel={(o) => o?.name ? `${o.name} • ${o.city}, ${o.state}` : ''}
            onInputChange={(_, v) => fetchSchools(v)}
            onChange={(_, v) => setSchoolA(v || null)}
            renderInput={(params) => <TextField {...params} label="Search School A" placeholder="Type at least 2 characters" />}
          />
          {renderCard(schoolA)}
        </Grid>
        <Grid item xs={12} md={6}>
          <Autocomplete
            loading={loading}
            options={options}
            getOptionLabel={(o) => o?.name ? `${o.name} • ${o.city}, ${o.state}` : ''}
            onInputChange={(_, v) => fetchSchools(v)}
            onChange={(_, v) => setSchoolB(v || null)}
            renderInput={(params) => <TextField {...params} label="Search School B" placeholder="Type at least 2 characters" />}
          />
          {renderCard(schoolB)}
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={saveComparison} disabled={!schoolA || !schoolB}>Save Comparison</Button>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}
