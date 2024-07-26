import { Module } from '@nestjs/common';
import { BidsService } from './bids.service';
import { BidsController } from './bids.controller';
import { PrismaService } from '../prisma.service';
import { AuctionGateway } from 'src/auction.gateway';

@Module({
  controllers: [BidsController],
  providers: [BidsService, PrismaService, AuctionGateway],
})
export class BidsModule {}
