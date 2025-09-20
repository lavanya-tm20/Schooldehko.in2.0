import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { TextField, Grid, MenuItem, Button, Stack, Typography, Box, Paper, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import SchoolCard from '../components/SchoolCard.jsx';
import EligibilityDialog from '../components/EligibilityDialog.jsx';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const [schools, setSchools] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ q: '', city: '', board: '', type: '' });
  const [eligOpen, setEligOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const highlightsRef = useRef(null);

  const boards = [
    { label: 'All', value: '' },
    { label: 'CBSE', value: 'cbse' },
    { label: 'ICSE', value: 'icse' },
    { label: 'IB', value: 'ib' },
    { label: 'IGCSE', value: 'igcse' },
    { label: 'State Board', value: 'state_board' },
  ];

  const types = [
    { label: 'All', value: '' },
    { label: 'Day School', value: 'day_school' },
    { label: 'Boarding School', value: 'boarding_school' },
    { label: 'Play School', value: 'play_school' },
    { label: 'PU/Junior College', value: 'pu_college' },
  ];

  const search = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''));
      const { data } = await api.get('/schools', { params });
      setSchools(data.rows || data.schools || data || []);
      setCount(data.count || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { search(); // initial load
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {/* Hero Section with gradient and image */}
      <Box sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 3,
        p: { xs: 3, md: 6 },
        mb: 4,
        background: 'linear-gradient(135deg, #eef3ff 0%, #e0f7ff 35%, #f3e8ff 100%)'
      }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={7}>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>{t('heroTitle')}</Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 3 }}>{t('heroSubtitle')}</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button size="large" variant="contained" onClick={() => navigate('/loans')} sx={{ bgcolor: '#2563eb', '&:hover': { bgcolor: '#1d4ed8' } }}>
                {t('heroCtaApply')}
              </Button>
              <Button size="large" variant="outlined" onClick={() => setEligOpen(true)}>
                {t('heroCtaEligibility')}
              </Button>
              <Button size="large" variant="text" onClick={() => highlightsRef.current?.scrollIntoView({ behavior: 'smooth' })}>
                {t('heroCtaExplore')} ↓
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box sx={{
              height: 280,
              borderRadius: 3,
              backgroundImage: 'url(https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=1400&auto=format&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }} />
          </Grid>
        </Grid>
      </Box>

      {/* Highlight cards */}
      <Box ref={highlightsRef} sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>Ready to Get Started?</Typography>
        <Grid container spacing={2}>
          {[{
            title: 'Find Schools', desc: 'Discover the perfect school for your child', action: 'Start Search', onClick: () => navigate('/schools')
          }, {
            title: 'Apply for Loan', desc: 'Get financial assistance for education', action: t('applyLoan'), onClick: () => navigate('/loans')
          }, {
            title: 'Find Scholarships', desc: 'Explore scholarship opportunities', action: 'Browse', onClick: () => navigate('/scholarships')
          }, {
            title: 'Alumni Network', desc: 'Connect with fellow graduates', action: 'Join Network', onClick: () => navigate('/alumni')
          }].map((c, idx) => (
            <Grid item xs={12} md={3} key={idx}>
              <Card sx={{ height: '100%', borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>{c.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{c.desc}</Typography>
                  <Button size="small" variant="outlined" onClick={c.onClick}>{c.action}</Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Typography variant="h5" sx={{ mb: 2 }}>Find the Best School Near You</Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={4}>
          <TextField fullWidth label={t('searchPlaceholder')} value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })} />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField fullWidth label="City" value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })} />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField fullWidth select label="Board" value={filters.board}
            onChange={(e) => setFilters({ ...filters, board: e.target.value })}>
            {boards.map(b => <MenuItem key={b.value} value={b.value}>{b.label}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid item xs={12} md={2}>
          <TextField fullWidth select label="Type" value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
            {types.map(t => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
          </TextField>
        </Grid>
      </Grid>
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Button variant="contained" onClick={search} disabled={loading}>{t('search')}</Button>
        <Button variant="outlined" onClick={() => { setFilters({ q: '', city: '', board: '', type: '' }); search(); }}>{t('reset')}</Button>
      </Stack>

      <Typography variant="subtitle1" sx={{ mb: 2 }}>{count} results</Typography>
      {schools.map((s) => (
        <SchoolCard key={s.id} school={s} />
      ))}

      {schools.length === 0 && !loading && (
        <Typography variant="body2">No schools found. Try adjusting filters.</Typography>
      )}

      <EligibilityDialog open={eligOpen} onClose={() => setEligOpen(false)} />
    </>
  );
}
