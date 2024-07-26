import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Home from '@/pages/index';
import axios from 'axios';
import nookies from 'nookies';
import { useRouter } from 'next/router';

vi.mock('axios');
vi.mock('nookies');
vi.mock('next/router', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe('Home Component', () => {
  it('renders loading state', () => {
    render(<Home />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders error message if there is an error', async () => {
    (axios.get as vi.Mock).mockRejectedValueOnce(new Error('An error occurred'));
    (nookies.get as vi.Mock).mockReturnValue({ token: 'test-token' });
    const { push } = useRouter();

    render(<Home />);
    await waitFor(() => expect(screen.getByText('An unexpected error occurred.')).toBeInTheDocument());
    expect(push).not.toHaveBeenCalled();
  });

  it('redirects to login if token is missing', () => {
    (nookies.get as vi.Mock).mockReturnValue({});
    const { push } = useRouter();

    render(<Home />);
    expect(push).toHaveBeenCalledWith('/login');
  });

  it('fetches and displays auctions', async () => {
    (axios.get as vi.Mock).mockResolvedValueOnce({
      data: [
        { id: 1, title: 'Auction 1', description: 'Description 1', endTime: new Date().toISOString() },
      ],
    });
    (nookies.get as vi.Mock).mockReturnValue({ token: 'test-token' });

    render(<Home />);
    await waitFor(() => {
      expect(screen.getByText('Auction 1')).toBeInTheDocument();
      expect(screen.getByText('Description 1')).toBeInTheDocument();
    });
  });
});
