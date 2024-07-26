// src/pages/edit-auction/[id].tsx
import { GetServerSideProps } from 'next';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

type Auction = {
  id: number;
  title: string;
  description: string;
  endTime: string;
};

interface Props {
  auction: Auction;
}

const EditAuctionPage = ({ auction }: Props) => {
  const [title, setTitle] = useState(auction.title);
  const [description, setDescription] = useState(auction.description);
  const [endTime, setEndTime] = useState(auction.endTime);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`/api/auctions/${auction.id}`, { title, description, endTime });
      router.push('/');
    } catch (error) {
      alert('Failed to update auction.');
    }
  };

  return (
    <div>
      <h1>Edit Auction</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
        />
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />
        <button type="submit">Update Auction</button>
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

export default EditAuctionPage;
