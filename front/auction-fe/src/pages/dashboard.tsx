// src/pages/dashboard.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';

type Auction = {
  id: number;
  title: string;
  description: string;
  endTime: string;
};

const Dashboard = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  
  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await axios.get('/api/users/me/auctions'); // Ajusta la ruta según tu API
        setAuctions(response.data);
      } catch (error) {
        alert('Failed to fetch auctions.');
      }
    };
    fetchAuctions();
  }, []);

  return (
    <div>
      <h1>Your Auctions</h1>
      <ul>
        {auctions.map((auction) => (
          <li key={auction.id}>
            <a href={`/auction/${auction.id}`}>
              <h2>{auction.title}</h2>
              <p>{auction.description}</p>
              <p>Ends at: {new Date(auction.endTime).toLocaleString()}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
