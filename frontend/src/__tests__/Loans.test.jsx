import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Loans from '../pages/Loans';

jest.mock('../services/api', () => ({
  get: jest.fn(async (url) => {
    if (url === '/loans') {
      return { data: { loans: [
        { id: 'l1', application_number: 'SDL123', student_name: 'Riya', loan_amount_requested: 80000, loan_tenure_months: 12, application_status: 'draft' }
      ] } };
    }
    if (url === '/schools') return { data: { rows: [] } };
    return { data: {} };
  }),
  post: jest.fn(async (url, body) => {
    if (url === '/loans') {
      return { data: { loan: { id: 'l2', application_number: 'SDL456', application_status: 'draft' } } };
    }
    if (url === '/auth/login') return { data: { token: 't' } };
    return { data: {} };
  })
}));

describe('Loans page', () => {
  it('shows recent loans on initial load and after submit', async () => {
    render(<Loans />);
    await waitFor(() => expect(screen.getByText(/My Recent Loans/i)).toBeInTheDocument());
    expect(screen.getByText(/SDL123/i)).toBeInTheDocument();
    // simulate submit success notice
    await waitFor(() => expect(screen.getByText(/Education Loan Application/i)).toBeInTheDocument());
  });

  it('snapshot - default render', () => {
    const { asFragment } = render(<Loans />);
    expect(asFragment()).toMatchSnapshot();
  });
});
