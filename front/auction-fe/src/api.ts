// src/api.ts
import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

export const fetchAuctions = async () => {
  return await axios.get(`${API_URL}/auctions`);
};

export const fetchAuction = async (id: number) => {
  return await axios.get(`${API_URL}/auctions/${id}`);
};

export const createAuction = async (auctionData: any) => {
  return await axios.post(`${API_URL}/auctions`, auctionData);
};

export const updateAuction = async (id: number, auctionData: any) => {
  return await axios.put(`${API_URL}/auctions/${id}`, auctionData);
};

export const placeBid = async (auctionId: number, bidAmount: number) => {
  return await axios.post(`${API_URL}/auctions/${auctionId}/bids`, { amount: bidAmount });
};
