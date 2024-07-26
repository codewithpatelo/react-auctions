// pages/index.tsx

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Auction } from '@/types';
import { useRouter } from 'next/router';
import Link from 'next/link';
import nookies from 'nookies';

const Home = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const cookies = nookies.get();
        const token = cookies.token;

        if (!token) {
          router.push('/login');
          return;
        }

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auctions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAuctions(response.data);
      } catch (err) {
        console.error(err);

        // Asegurarse de que err sea un Error
        if (axios.isAxiosError(err)) {
          // Verificar si el error tiene respuesta y manejarlo adecuadamente
          if (err.response) {
            setError(`Failed to fetch auctions: ${err.response.statusText}`);
            if (err.response.status === 401) {
              router.push('/login');
            }
          } else {
            setError('An unexpected error occurred.');
          }
        } else {
          setError('An unknown error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, [router]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Active Auctions</h1>
      <div className="mb-4">
        <Link href="/create-auction">
          <p className="px-4 py-2 bg-blue-500 text-white rounded">Add Auction</p>
        </Link>
        <Link href="/api/auth/signout">
          <p className="px-4 py-2 bg-red-500 text-white rounded ml-4">Sign Out</p>
        </Link>
      </div>
      <ul className="divide-y divide-gray-200">
        {auctions.map((auction) => (
          <li key={auction.id} className="flex justify-between gap-x-6 py-5">
            <div className="flex min-w-0 gap-x-4">
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold leading-6 text-gray-900">{auction.title}</p>
                <p className="mt-1 truncate text-xs leading-5 text-gray-500">{auction.description}</p>
              </div>
            </div>
            <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
              <p className="text-sm leading-6 text-gray-900">Ends at: {new Date(auction.endTime).toLocaleString()}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
