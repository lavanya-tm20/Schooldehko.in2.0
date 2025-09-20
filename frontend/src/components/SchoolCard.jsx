import React from 'react';
import { Card, CardContent, CardHeader, Typography, Chip, Stack } from '@mui/material';

export default function SchoolCard({ school }) {
  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardHeader title={school.name} subheader={`${school.city}, ${school.state}`} />
      <CardContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Board: {school.board} • Type: {school.school_type} • Rating: {school.rating}
        </Typography>
        {Array.isArray(school.facilities) && school.facilities.length > 0 && (
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
            {school.facilities.slice(0, 6).map((f, i) => (
              <Chip key={i} label={f} size="small" />
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
