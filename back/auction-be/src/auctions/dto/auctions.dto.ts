export class CreateAuctionDto {
  title: string;
  description: string;
  startingPrice: number;
  currentPrice: number;
  userId: number;
  endTime: Date;
}

export class UpdateAuctionDto {
  title?: string;
  description?: string;
  startingPrice?: number;
  currentPrice?: number;
  endTime?: Date;
}
