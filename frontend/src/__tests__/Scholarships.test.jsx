import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Scholarships from '../pages/Scholarships';

jest.mock('../services/api', () => ({
  get: jest.fn(async (url, { params } = {}) => {
    if (url === '/scholarships') {
      const all = {
        scholarships: [
          { id: 's1', name: 'Merit Star', provider: 'Govt', scholarship_type: 'merit', description: 'A', application_end_date: new Date().toISOString() },
          { id: 's2', name: 'Need Assist', provider: 'Private', scholarship_type: 'need_based', description: 'B', application_end_date: new Date().toISOString() }
        ]
      };
      return { data: all };
    }
    return { data: {} };
  })
}));

describe('Scholarships page', () => {
  it('loads default scholarships on mount and resets', async () => {
    render(<Scholarships />);
    await waitFor(() => expect(screen.getByText(/Scholarships/i)).toBeInTheDocument());
    expect(screen.getAllByText(/Apply by:/i).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByText(/Reset/i));
    await waitFor(() => expect(screen.getByText(/Scholarships/i)).toBeInTheDocument());
  });

  it('snapshot - default render', () => {
    const { asFragment } = render(<Scholarships />);
    expect(asFragment()).toMatchSnapshot();
  });
});
