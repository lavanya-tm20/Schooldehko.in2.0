import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Policies from '../pages/Policies';

jest.mock('../services/api', () => ({
  get: jest.fn(async (url, { params } = {}) => {
    if (url === '/policies') {
      return { data: { policies: [
        { id: 'p1', title: 'Safety Policy', type: 'safety', content: '...' },
        { id: 'p2', title: 'Code of Conduct', type: 'code_of_conduct', content: '...' }
      ] } };
    }
    if (url.startsWith('/schools/') && url.endsWith('/policies')) {
      return { data: { policies: [{ id: 'sp1', title: 'School Safety', type: 'safety', content: '...' }] } };
    }
    if (url === '/schools') return { data: { rows: [] } };
    return { data: {} };
  })
}));

describe('Policies page', () => {
  it('loads policies on mount and resets to all', async () => {
    render(<Policies />);
    await waitFor(() => expect(screen.getByText(/Policies & Regulations/i)).toBeInTheDocument());
    expect(screen.getByText(/Safety Policy/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Search/i));
    fireEvent.click(screen.getByText(/Reset/i));
    await waitFor(() => expect(screen.getByText(/Safety Policy/i)).toBeInTheDocument());
  });

  it('snapshot - default render', () => {
    const { asFragment } = render(<Policies />);
    expect(asFragment()).toMatchSnapshot();
  });
});
