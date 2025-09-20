import React, { useMemo, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField, MenuItem, Typography, Alert, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function EligibilityDialog({ open, onClose }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    monthly_income: 50000,
    existing_emi: 0,
    loan_amount: 80000,
    tenure_months: 12,
    employment_type: 'salaried',
    interest_rate: 12,
  });

  const employmentTypes = ['salaried','self_employed','business','professional','other'];

  const result = useMemo(() => {
    // Disposable income heuristic
    const disposable = Math.max(0, Number(form.monthly_income) - Number(form.existing_emi));
    const monthlyRate = Number(form.interest_rate) / 100 / 12;
    const n = Number(form.tenure_months);
    const p = Number(form.loan_amount);

    let emi = 0;
    if (p > 0 && n > 0 && monthlyRate > 0) {
      emi = (p * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
    } else if (p > 0 && n > 0) {
      emi = p / n; // zero-rate fallback
    }

    // simple score out of 100
    let score = 50;
    const ratio = disposable > 0 ? disposable / emi : 0;
    if (ratio >= 3) score += 30; else if (ratio >= 2) score += 20; else if (ratio >= 1.5) score += 10; else score -= 10;
    if (form.employment_type === 'salaried' || form.employment_type === 'professional') score += 10;
    if (form.loan_amount <= 100000) score += 5;

    const verdict = score >= 60 ? 'Likely Eligible' : score >= 45 ? 'Borderline' : 'Unlikely';

    return {
      emi: Math.round(emi),
      score: Math.round(score),
      verdict,
      disposable: Math.round(disposable)
    };
  }, [form]);

  const proceed = () => {
    onClose?.();
    navigate('/loans');
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Check Eligibility</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField fullWidth type="number" label="Monthly Income (₹)" value={form.monthly_income}
              onChange={(e)=>setForm({ ...form, monthly_income: Number(e.target.value) })} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth type="number" label="Existing EMI (₹)" value={form.existing_emi}
              onChange={(e)=>setForm({ ...form, existing_emi: Number(e.target.value) })} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth type="number" label="Loan Amount (₹)" value={form.loan_amount}
              onChange={(e)=>setForm({ ...form, loan_amount: Number(e.target.value) })} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth type="number" label="Tenure (months)" value={form.tenure_months}
              onChange={(e)=>setForm({ ...form, tenure_months: Number(e.target.value) })} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth select label="Employment Type" value={form.employment_type}
              onChange={(e)=>setForm({ ...form, employment_type: e.target.value })}>
              {employmentTypes.map(t => <MenuItem key={t} value={t}>{t.toUpperCase()}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth type="number" label="Interest Rate (% p.a.)" value={form.interest_rate}
              onChange={(e)=>setForm({ ...form, interest_rate: Number(e.target.value) })} />
          </Grid>
          <Grid item xs={12}>
            <Alert severity={result.verdict === 'Likely Eligible' ? 'success' : result.verdict === 'Borderline' ? 'warning' : 'error'}>
              <Stack>
                <Typography><strong>Verdict:</strong> {result.verdict}</Typography>
                <Typography><strong>Score:</strong> {result.score} / 100</Typography>
                <Typography><strong>Indicative EMI:</strong> ₹{result.emi} • <strong>Disposable:</strong> ₹{result.disposable}</Typography>
              </Stack>
            </Alert>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" onClick={proceed}>Proceed to Loan</Button>
      </DialogActions>
    </Dialog>
  );
}
