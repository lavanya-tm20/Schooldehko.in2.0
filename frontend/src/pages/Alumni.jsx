import React, { useState, useEffect } from 'react';
import { Typography, Grid, TextField, MenuItem, Button, Card, CardContent, Stack, Alert, Autocomplete } from '@mui/material';
import api from '../services/api';
import Section from '../components/Section';

export default function Alumni() {
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [school, setSchool] = useState(null);
  const [year, setYear] = useState('');
  const [alumni, setAlumni] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const years = Array.from({ length: 40 }, (_, i) => new Date().getFullYear() - i);

  const fetchSchools = async (q) => {
    if (!q || q.trim().length < 2) { setSchoolOptions([]); return; }
    setLoadingSchools(true);
    try {
      const { data } = await api.get('/schools', { params: { q, limit: 10 } });
      setSchoolOptions(data.rows || data.schools || []);
    } catch (e) { /* ignore */ } finally { setLoadingSchools(false); }
  };

  const loadAlumni = async () => {
    setError('');
    try {
      const params = {};
      if (school?.id) params.school_id = school.id;
      if (year) params.year = year;
      const { data } = await api.get('/alumni', { params });
      const list = data.alumni || [];
      if (list.length === 0) {
        // Fallback demo data
        setAlumni([
          { id: 'demo1', passing_year: 2020, current_company: 'Infosys', designation: 'SE', bio: 'Math club lead', user: { first_name: 'Riya', last_name: 'Sharma' } },
          { id: 'demo2', passing_year: 2019, current_company: 'TCS', designation: 'Analyst', bio: 'Debate champion', user: { first_name: 'Arjun', last_name: 'Verma' } },
          { id: 'demo3', passing_year: 2018, current_company: 'Accenture', designation: 'Consultant', bio: 'State swimmer', user: { first_name: 'Neha', last_name: 'Joshi' } }
        ]);
      } else {
        setAlumni(list);
      }
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load alumni');
    }
  };

  // Load all alumni on mount
  useEffect(() => { loadAlumni(); /* eslint-disable-next-line */ }, []);
  // Re-load on filter change
  useEffect(() => { if (school || year) loadAlumni(); /* eslint-disable-next-line */ }, [school, year]);

  // Minimal profile form
  const [profile, setProfile] = useState({ school_id: '', passing_year: '', current_company: '', designation: '', bio: '' });

  const saveProfile = async () => {
    setSaving(true); setMsg(''); setError('');
    try {
      if (!profile.school_id) throw new Error('Select a school for your alumni profile');
      if (!profile.passing_year) throw new Error('Passing year is required');
      const { data } = await api.post('/alumni', profile);
      setMsg('Alumni profile saved');
      setProfile({ ...profile, id: data.profile?.id });
      loadAlumni();
    } catch (e) { setError(e?.response?.data?.message || e.message || 'Failed to save alumni profile'); }
    finally { setSaving(false); }
  };

  return (
    <>
      <Typography variant="h5" sx={{ mb: 2 }}>Alumni</Typography>
      {msg && <Alert severity="success" sx={{ mb: 2 }}>{msg}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Section gradient="gray" sx={{ mb: 4 }}>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={5}>
          <Autocomplete
            loading={loadingSchools}
            options={schoolOptions}
            getOptionLabel={(o) => o?.name ? `${o.name} • ${o.city}, ${o.state}` : ''}
            onInputChange={(_, v) => fetchSchools(v)}
            onChange={(_, v) => { setSchool(v || null); setProfile({ ...profile, school_id: v?.id || '' }); }}
            renderInput={(params) => <TextField {...params} label="Filter by School" placeholder="Type at least 2 characters" />}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField fullWidth select label="Passing Year" value={year} onChange={(e)=>setYear(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            {years.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid item xs={12} md={2}>
          <Stack direction="row" spacing={1}>
            <Button variant="contained" onClick={loadAlumni}>Search</Button>
            <Button variant="outlined" onClick={() => { setSchool(null); setYear(''); loadAlumni(); }}>Reset</Button>
          </Stack>
        </Grid>
      </Grid>

      <Typography variant="subtitle1" sx={{ mb: 1 }}>Create / Update My Alumni Profile</Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <TextField fullWidth select label="School Selected" value={profile.school_id} disabled helperText="Choose a school above">
            <MenuItem value="">None</MenuItem>
            {schoolOptions.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid item xs={12} md={2}>
          <TextField fullWidth select label="Passing Year" value={profile.passing_year} onChange={(e)=>setProfile({ ...profile, passing_year: e.target.value })}>
            {years.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField fullWidth label="Current Company" value={profile.current_company} onChange={(e)=>setProfile({ ...profile, current_company: e.target.value })} />
        </Grid>
        <Grid item xs={12} md={2}>
          <TextField fullWidth label="Designation" value={profile.designation} onChange={(e)=>setProfile({ ...profile, designation: e.target.value })} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Bio" multiline minRows={2} value={profile.bio} onChange={(e)=>setProfile({ ...profile, bio: e.target.value })} />
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={saveProfile} disabled={saving}>Save Profile</Button>
          </Stack>
        </Grid>
      </Grid>

      <Typography variant="subtitle1" sx={{ mb: 1 }}>Alumni Directory</Typography>
      <Grid container spacing={2}>
        {alumni.map((a) => (
          <Grid item xs={12} md={6} key={a.id}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1">{a.user?.first_name ? `${a.user.first_name} ${a.user.last_name}` : 'Alumni'}</Typography>
                <Typography variant="body2" color="text.secondary">Passing Year: {a.passing_year}</Typography>
                <Typography variant="body2">{a.current_company} • {a.designation}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>{a.bio}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {alumni.length === 0 && !error && (
          <Grid item xs={12}><Alert severity="info">No alumni found for the current filters.</Alert></Grid>
        )}
      </Grid>
      </Section>
    </>
  );
}
