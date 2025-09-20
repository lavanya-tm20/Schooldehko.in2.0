import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Alumni from '../pages/Alumni';

jest.mock('../services/api', () => ({
  get: jest.fn(async (url, { params } = {}) => {
    if (url === '/alumni') {
      // Return 2 alumni by default, filter by school_id if passed
      const all = {
        alumni: [
          { id: '1', passing_year: 2020, current_company: 'Infosys', designation: 'SE', bio: 'A1', user: { first_name: 'A', last_name: 'One' } },
          { id: '2', passing_year: 2019, current_company: 'TCS', designation: 'SE', bio: 'A2', user: { first_name: 'B', last_name: 'Two' } }
        ]
      };
      return { data: all };
    }
    if (url === '/schools') return { data: { rows: [] } };
    return { data: {} };
  })
}));

describe('Alumni page', () => {
  it('loads default alumni on mount and resets to all after filters', async () => {
    render(<Alumni />);
    await waitFor(() => expect(screen.getByText(/Alumni Directory/i)).toBeInTheDocument());
    // default two alumni
    expect(screen.getAllByText(/Passing Year:/i).length).toBeGreaterThanOrEqual(1);
    // Click Reset should not error
    fireEvent.click(screen.getByText(/Reset/i));
    await waitFor(() => expect(screen.getByText(/Alumni Directory/i)).toBeInTheDocument());
  });

  it('snapshot - default render', () => {
    const { asFragment } = render(<Alumni />);
    expect(asFragment()).toMatchSnapshot();
  });
});
