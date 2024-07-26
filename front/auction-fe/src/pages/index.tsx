// pages/index.tsx

import { GetServerSideProps } from 'next';
import axios from 'axios';
import { Auction } from '@/types';
import { isAuthenticated } from '../lib/auth';
import Link from 'next/link';

interface Props {
  auctions: Auction[];
}

const Home = ({ auctions }: Props) => {
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const authenticated = isAuthenticated(ctx);

  if (!authenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auctions`, {
      headers: { cookie: ctx.req.headers.cookie },
    });
    return {
      props: {
        auctions: response.data,
      },
    };
  } catch (error) {
    return {
      props: {
        auctions: [],
      },
    };
  }
};

export default Home;
