import React, { useEffect, useState } from 'react';
import { Typography, Alert, Card, CardContent, Grid, Chip, Stack } from '@mui/material';
import api from '../services/api';

export default function MyLoans() {
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoans = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get('/loans');
        setLoans(data.loans || []);
      } catch (e) {
        setError(e?.response?.data?.message || 'Failed to load your loans. Make sure you are logged in.');
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, []);

  return (
    <>
      <Typography variant="h5" sx={{ mb: 2 }}>My Loan Applications</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {!error && loans.length === 0 && !loading && (
        <Alert severity="info">No loan applications yet. Go to the Loans page to submit one.</Alert>
      )}

      <Grid container spacing={2}>
        {loans.map((l) => (
          <Grid item xs={12} md={6} key={l.id}>
            <Card variant="outlined">
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="subtitle1">{l.application_number}</Typography>
                  <Chip label={String(l.application_status).toUpperCase()} color="primary" size="small" />
                </Stack>
                <Typography variant="body2" sx={{ mb: 0.5 }}>Student: {l.student_name} • Class: {l.student_class} • Age: {l.student_age}</Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>Parent: {l.parent_name} ({l.parent_occupation})</Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>Loan: ₹{l.loan_amount_requested} • Tenure: {l.loan_tenure_months} months • Purpose: {String(l.loan_purpose).replace('_',' ')}</Typography>
                <Typography variant="caption" color="text.secondary">Created: {new Date(l.created_at || l.createdAt).toLocaleString()}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
