import { Module } from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { AuctionsController } from './auctions.controller';
import { PrismaService } from '../prisma.service';
import { AuctionGateway } from 'src/auction.gateway';

@Module({
  controllers: [AuctionsController],
  providers: [AuctionsService, PrismaService, AuctionGateway],
})
export class AuctionsModule {}
