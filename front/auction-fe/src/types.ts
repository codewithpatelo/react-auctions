// src/types/index.ts
  export type Auction = {
    id?: number;
    title: string;
    description: string;
    startingPrice: string;
    userId: number;
    endTime: string;
  };


  
  export type User = {
    id: number;
    email: string;
    name: string;
  };
  