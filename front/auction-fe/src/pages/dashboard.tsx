// Este es nuestro tablero de control
// Aca veremos las subastas de nuestro usuario y sus respectivas pujas agrupadas por subasta
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import { io } from 'socket.io-client';
import nookies from 'nookies';
import { Auction, User, Bid } from '@/types';


// Client Socket.IO
const socket = io(process.env.NEXT_PUBLIC_API_URL as string);

const Dashboard = () => {
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Chequeamos auth
        const cookies = nookies.get();
        const token = cookies.token;

        if (!token) {
          router.push('/login');
          return;
        }

        // Primero obtenemos datos del perfil del usuario
        const profileResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserProfile(profileResponse.data);

        // Una vez obtenido ese dato, procedemos a obtener el listado de subastas
        const auctionsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auctions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Filtramos aquellas que sean del usuario
        const userAuctions = auctionsResponse.data.filter((auction: Auction) => Number(auction.userId) === Number(profileResponse.data.id));
        setAuctions(userAuctions);

        // Por cada subasta, obtenemos sus respectivas pujas
        const userBids: Bid[] = [];
        for (const auction of userAuctions) {
          const bidsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auctions/${auction.id}/bids`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          userBids.push(...bidsResponse.data);
        }
        setBids(userBids);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch data.');
        if (axios.isAxiosError(err)) {
          if (err.response && err.response.status === 401) {
            router.push('/login');
          }
        }
      }
    };

    fetchData();


  }, [router]);

  useEffect(() => {

    // Aca manejamos los mensajes del socket...
    socket.on('auctionUpdate', (data) => {

      const newAuction = data as Auction;

      // Agregamos el nuevo bid a la lista existente sin necesidad de hacer una nueva llamada fetch
      setAuctions((prevAuctions) => [newAuction, ...prevAuctions]);
    });

    socket.on('bidUpdate', (data) => {
      const newBid = data as Bid;

      // Agregamos el nuevo bid a la lista existente
      setBids((prevBids) => [newBid, ...prevBids]);
    });

    return () => {
      socket.off('auctionUpdate');
      socket.off('bidUpdate');
    };
  }, []);


  // Mostramos errores si los hay...
  if (error) return <div>{error}</div>;
  if (!userProfile) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <div className="nav lg:flex lg:items-center lg:justify-between mb-6">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Dashboard {bids.length}
          </h1>
        </div>
        <div className="mt-5 flex lg:ml-4 lg:mt-0">
          <Link href="/" passHref>
            <p className="inline-flex items-center rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-300 cursor-pointer">
              <ArrowLeftIcon aria-hidden="true" className="-ml-0.5 mr-1.5 h-5 w-5" />
              Back
            </p>
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">User ({userProfile.email})</h2>
      </div>

      <div className="form mx-auto max-w-4xl">
        <h2 className="text-xl font-semibold text-gray-900">Your Auctions</h2>
        {auctions.map((auction) => {
          const auctionBids = bids.filter((bid) => bid.auctionId === auction.id);

          return (
            <Link key={auction.id} href={`/auction/${auction.id}`} passHref>
              <p className="block p-4 mb-4 border border-gray-200 rounded-lg hover:bg-gray-100 transition duration-300 ease-in-out">
                <h3 className="text-lg font-medium text-gray-900">{auction.title}</h3>
                {auctionBids.length === 0 ? (
                  <p className="text-gray-600 mt-2">No bids for this auction</p>
                ) : (
                  <ul className="divide-y divide-gray-200 mt-2">
                    {auctionBids.map((bid) => (
                      <li key={bid.id} className="py-4 flex justify-between items-center">
                        <span className="text-sm text-gray-600">Bid ID: {bid.id}</span>
                        <span className="text-sm font-medium text-gray-900">${bid.amount}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
