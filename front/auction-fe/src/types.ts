// src/types/index.ts
  export type Auction = {
    id?: number;
    title: string;
    description: string;
    startingPrice: string;
    userId: number;
    endTime: string;
  };

  export interface Bid {
    id: number;
    amount: number;
    auctionId: number;
  }
  
  export type User = {
    id: number;
    email: string;
    name: string;
  };
  

