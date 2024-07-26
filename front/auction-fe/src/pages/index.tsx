// pages/index.tsx

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Auction } from '@/types';
import { useRouter } from 'next/router';
import Link from 'next/link';
import nookies from 'nookies';
import {
  PlusIcon,
  LinkIcon,
  ChevronDownIcon,
  HomeIcon // Importa el ícono de dashboard
} from '@heroicons/react/20/solid';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';

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

        if (axios.isAxiosError(err)) {
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
      <div className="lg:flex lg:items-center lg:justify-between mb-6">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Active Auctions
          </h1>
        </div>
        <div className="mt-5 flex lg:ml-4 lg:mt-0">
          {/* New Dashboard Button */}
          <span className="hidden sm:block">
            <Link href="/dashboard">
              <p className="inline-flex items-center rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-300">
                <HomeIcon aria-hidden="true" className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-500" />
                Dashboard
              </p>
            </Link>
          </span>

          <span className="ml-3 hidden sm:block">
            <Link href="/create-auction">
              <p className="inline-flex items-center rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600">
                <PlusIcon aria-hidden="true" className="-ml-0.5 mr-1.5 h-5 w-5 text-white" />
                Add Auction
              </p>
            </Link>
          </span>

          <span className="ml-3 hidden sm:block">
            <Link href="/api/auth/signout">
              <p className="inline-flex items-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-600">
                <LinkIcon aria-hidden="true" className="-ml-0.5 mr-1.5 h-5 w-5 text-white" />
                Sign Out
              </p>
            </Link>
          </span>

          {/* Dropdown */}
          <Menu as="div" className="relative ml-3 sm:hidden">
            <MenuButton className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400">
              More
              <ChevronDownIcon aria-hidden="true" className="-mr-1 ml-1.5 h-5 w-5 text-gray-400" />
            </MenuButton>

            <MenuItems
              transition
              className="absolute right-0 z-10 -mr-1 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
            >
              <MenuItem>
                <p className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                  Edit
                </p>
              </MenuItem>
              <MenuItem>
                <p className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                  View
                </p>
              </MenuItem>
            </MenuItems>
          </Menu>
        </div>
      </div>

      <ul className="divide-y divide-gray-200">
        {auctions.map((auction) => (
          <Link key={auction.id} href={`/auction/${auction.id}`} passHref>
            <p className="block cursor-pointer hover:bg-gray-100">
              <li className="flex justify-between gap-x-6 py-5">
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
            </p>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default Home;
