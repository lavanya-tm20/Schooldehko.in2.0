import React, { useState } from 'react';
import { TextField, Grid, Button, Stack, Typography, Alert, MenuItem, Autocomplete } from '@mui/material';
import api from '../services/api';
import GlassCard from '../components/GlassCard';
import Hero from '../components/Hero';

export default function Loans() {
  // Prefill demo credentials to help users log in quickly
  const [auth, setAuth] = useState({ email: 'admin@schooldekho.in', password: 'Admin@123' });
  const [authMsg, setAuthMsg] = useState('');

  const [form, setForm] = useState({
    school_id: '',
    student_name: '',
    student_class: '',
    student_age: 5,
    parent_name: '',
    parent_occupation: '',
    annual_income: 0,
    loan_amount_requested: 0,
    loan_purpose: 'complete_education',
    loan_tenure_months: 12,
    employment_type: 'salaried',
    work_experience_years: 0,
    monthly_income: 0,
  });
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState(null);
  const [error, setError] = useState('');
  const [myLoans, setMyLoans] = useState([]);

  // School search state
  const [schoolQuery, setSchoolQuery] = useState('');
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [loadingSchools, setLoadingSchools] = useState(false);

  const classes = [
    'playgroup','nursery','lkg','ukg',
    ...Array.from({ length: 12 }, (_, i) => (i+1).toString())
  ];

  const purposes = [
    'admission_fee','annual_fee','monthly_fee','transport_fee','books_uniform','infrastructure','complete_education','other'
  ];

  const employmentTypes = ['salaried','self_employed','business','professional','other'];

  const login = async () => {
    setAuthMsg('');
    try {
      const { data } = await api.post('/auth/login', auth);
      localStorage.setItem('sdk_token', data.token);
      setAuthMsg('Logged in successfully. You can now submit a loan application.');
      // Load loans right after login
      loadMyLoans();
    } catch (e) {
      const msg = e?.response?.data?.message || 'Login failed. Please check your credentials or register via API.';
      setAuthMsg(msg);
    }
  };

  // Fetch schools as user types
  const fetchSchools = async (q) => {
    if (!q || q.trim().length < 2) { setSchoolOptions([]); return; }
    setLoadingSchools(true);
    try {
      const { data } = await api.get('/schools', { params: { q, limit: 10 } });
      const rows = data.rows || data.schools || [];
      setSchoolOptions(rows);
    } catch (err) {
      // ignore for now
    } finally {
      setLoadingSchools(false);
    }
  };

  // Load user's loans on mount
  const loadMyLoans = async () => {
    try {
      const { data } = await api.get('/loans');
      setMyLoans(data.loans || []);
    } catch (e) {
      // ignore silently if not logged in yet
    }
  };

  React.useEffect(() => { loadMyLoans(); }, []);

  const submitLoan = async () => {
    setCreating(true);
    setError('');
    try {
      if (!form.school_id) throw new Error('Please select a School.');
      if (!form.student_name) throw new Error('Please enter Student Name.');
      if (!form.student_class) throw new Error('Please select Class.');
      const payload = { ...form, student_age: Number(form.student_age), annual_income: Number(form.annual_income), loan_amount_requested: Number(form.loan_amount_requested), loan_tenure_months: Number(form.loan_tenure_months), work_experience_years: Number(form.work_experience_years), monthly_income: Number(form.monthly_income) };
      const { data } = await api.post('/loans', payload);
      setCreated(data.loan);
      loadMyLoans();
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Failed to create loan. Ensure you are logged in.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <Hero
        title="Education Loan Application"
        subtitle="Login with the demo account and submit your first application in seconds."
        actions={[{ label: 'Scholarships', variant: 'outlined', onClick: () => window.location.assign('/scholarships') }]}
      />

      {authMsg && <Alert severity={authMsg.startsWith('Logged') ? 'success' : 'info'} sx={{ mb: 2 }}>{authMsg}</Alert>}

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={5}>
          <GlassCard sx={{ height: '100%' }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Login (demo)</Typography>
            <Stack spacing={2}>
              <TextField fullWidth label="Email" value={auth.email} onChange={(e) => setAuth({ ...auth, email: e.target.value })} helperText="Use the demo: admin@schooldekho.in" />
              <TextField fullWidth label="Password" type="password" value={auth.password} onChange={(e) => setAuth({ ...auth, password: e.target.value })} helperText="Use the demo: Admin@123" />
              <Button variant="contained" onClick={login}>Login</Button>
            </Stack>
          </GlassCard>
        </Grid>

        <Grid item xs={12} md={7}>
          <GlassCard>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>Loan Details</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Autocomplete
                  loading={loadingSchools}
                  options={schoolOptions}
                  getOptionLabel={(o) => o?.name ? `${o.name} • ${o.city}, ${o.state}` : ''}
                  onInputChange={(_, v) => { setSchoolQuery(v); fetchSchools(v); }}
                  onChange={(_, v) => setForm({ ...form, school_id: v?.id || '' })}
                  renderInput={(params) => (
                    <TextField {...params} label="Select School" placeholder="Type at least 2 characters" helperText={form.school_id ? `Selected School ID: ${form.school_id}` : 'Start typing to search schools'} />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Student Name" value={form.student_name} onChange={(e) => setForm({ ...form, student_name: e.target.value })} placeholder="e.g., Riya Sharma" />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField fullWidth select label="Class" value={form.student_class} onChange={(e) => setForm({ ...form, student_class: e.target.value })}>
                  {classes.map(c => <MenuItem key={c} value={c}>{c.toUpperCase()}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField fullWidth type="number" label="Student Age" value={form.student_age} onChange={(e) => setForm({ ...form, student_age: e.target.value })} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Parent Name" value={form.parent_name} onChange={(e) => setForm({ ...form, parent_name: e.target.value })} placeholder="e.g., Ankit Sharma" />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Parent Occupation" value={form.parent_occupation} onChange={(e) => setForm({ ...form, parent_occupation: e.target.value })} placeholder="e.g., Engineer" />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth type="number" label="Annual Income (₹)" value={form.annual_income} onChange={(e) => setForm({ ...form, annual_income: e.target.value })} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth type="number" label="Loan Amount Requested (₹)" value={form.loan_amount_requested} onChange={(e) => setForm({ ...form, loan_amount_requested: e.target.value })} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth type="number" label="Loan Tenure (months)" value={form.loan_tenure_months} onChange={(e) => setForm({ ...form, loan_tenure_months: e.target.value })} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth select label="Loan Purpose" value={form.loan_purpose} onChange={(e) => setForm({ ...form, loan_purpose: e.target.value })}>
                  {purposes.map(p => <MenuItem key={p} value={p}>{p.replace('_',' ').toUpperCase()}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth select label="Employment Type" value={form.employment_type} onChange={(e) => setForm({ ...form, employment_type: e.target.value })}>
                  {employmentTypes.map(p => <MenuItem key={p} value={p}>{p.replace('_',' ').toUpperCase()}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth type="number" label="Work Exp (years)" value={form.work_experience_years} onChange={(e) => setForm({ ...form, work_experience_years: e.target.value })} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth type="number" label="Monthly Income (₹)" value={form.monthly_income} onChange={(e) => setForm({ ...form, monthly_income: e.target.value })} />
              </Grid>
            </Grid>

            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
              <Button variant="contained" onClick={submitLoan} disabled={creating}>Submit Loan</Button>
            </Stack>

            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            {created && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Loan created! Application No: <b>{created.application_number}</b> | Status: {created.application_status}
              </Alert>
            )}
          </GlassCard>
        </Grid>
      </Grid>

      {/* My Loans Section */}
      <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>My Recent Loans</Typography>
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Button size="small" variant="outlined" onClick={loadMyLoans}>Refresh</Button>
      </Stack>
      <Grid container spacing={2}>
        {myLoans.map(l => (
          <Grid item xs={12} md={6} key={l.id}>
            <Alert severity="info">
              {l.application_number} • {l.student_name} • ₹{l.loan_amount_requested} / {l.loan_tenure_months}m • {String(l.application_status).toUpperCase()}
            </Alert>
          </Grid>
        ))}
        {myLoans.length === 0 && (
          <Grid item xs={12}><Alert severity="info">No loans yet. Submit your first application above.</Alert></Grid>
        )}
      </Grid>
    </>
  );
}
