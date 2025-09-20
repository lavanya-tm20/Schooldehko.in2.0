import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Fundraising from '../pages/Fundraising';

jest.mock('../services/api', () => ({
  get: jest.fn(async (url, { params } = {}) => {
    if (url === '/fundraising') {
      return { data: { campaigns: [
        { id: 'c1', title: 'Library Upgrade', description: 'Books and shelves', goal_amount: 100000, raised_amount: 25000 },
        { id: 'c2', title: 'Playground', description: 'Swings and slides', goal_amount: 50000, raised_amount: 10000 }
      ] } };
    }
    return { data: {} };
  }),
  post: jest.fn(async () => ({ data: {} }))
}));

describe('Fundraising page', () => {
  it('loads campaigns on mount and resets', async () => {
    render(<Fundraising />);
    await waitFor(() => expect(screen.getByText(/Fundraising Campaigns/i)).toBeInTheDocument());
    expect(screen.getByText(/Library Upgrade/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Reset/i));
    await waitFor(() => expect(screen.getByText(/Fundraising Campaigns/i)).toBeInTheDocument());
  });

  it('snapshot - default render', () => {
    const { asFragment } = render(<Fundraising />);
    expect(asFragment()).toMatchSnapshot();
  });
});
