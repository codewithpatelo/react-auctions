// src/api.ts
import axios from 'axios';
import { Auction } from './types';

const API_URL = 'http://localhost:4000/api';

export const fetchAuctions = async () => {
  return await axios.get(`${API_URL}/auctions`);
};

export const fetchAuction = async (id: number) => {
  return await axios.get(`${API_URL}/auctions/${id}`);
};

export const createAuction = async (auctionData: Auction) => {
  return await axios.post(`${API_URL}/auctions`, auctionData);
};

export const updateAuction = async (id: number, auctionData: any) => {
  return await axios.put(`${API_URL}/auctions/${id}`, auctionData);
};

export const deleteAuction = async (id: number) => {
  return await axios.delete(`${API_URL}/auctions/${id}`);
};

export const placeBid = async (auctionId: number, bidAmount: number, userId: number) => {
  const bid = { auctionId: auctionId, amount: bidAmount, userId: userId };
  return await axios.post(`${API_URL}/auctions/${auctionId}/bids`, bid);
};


