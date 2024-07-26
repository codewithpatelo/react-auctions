import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { AuctionsModule } from './auctions/auctions.module';
import { AuthModule } from './auth/auth.module';
import { BidsModule } from './bids/bids.module';
import { AuctionGateway } from './auction.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    AuctionsModule,
    BidsModule,
  ],
  providers: [PrismaService, AuctionGateway],
  exports: [AuctionGateway],
})
export class AppModule {}
