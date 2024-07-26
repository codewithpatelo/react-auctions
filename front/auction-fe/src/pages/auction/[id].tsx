// src/pages/auction/[id].tsx
import { GetServerSideProps } from 'next';
import axios from 'axios';
import { useState } from 'react';

type Auction = {
  id: number;
  title: string;
  description: string;
  endTime: string;
};

interface Props {
  auction: Auction;
}

const AuctionPage = ({ auction }: Props) => {
  const [bid, setBid] = useState<number | ''>('');

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof bid === 'number') {
      try {
        await axios.post(`/api/auctions/${auction.id}/bids`, { amount: bid });
        alert('Bid placed successfully!');
      } catch (error) {
        alert('Failed to place bid.');
      }
    }
  };

  return (
    <div>
      <h1>{auction.title}</h1>
      <p>{auction.description}</p>
      <p>Ends at: {new Date(auction.endTime).toLocaleString()}</p>

      <form onSubmit={handleBidSubmit}>
        <input
          type="number"
          value={bid}
          onChange={(e) => setBid(Number(e.target.value))}
          placeholder="Enter your bid"
          min="1"
          required
        />
        <button type="submit">Place Bid</button>
      </form>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  try {
    const response = await axios.get(`/api/auctions/${id}`);
    return {
      props: {
        auction: response.data,
      },
    };
  } catch (error) {
    return {
      props: {
        auction: null,
      },
    };
  }
};

export default AuctionPage;
