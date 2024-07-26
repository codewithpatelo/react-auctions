import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { AuctionsModule } from './auctions/auctions.module';
import { AuthModule } from './auth/auth.module';
import { BidsModule } from './bids/bids.module';
import { AuctionGateway } from './auction.gateway';

// Tenemos 3 modulos con los que cubriremos los requerimentos funcionales de la aplicación
// Auth -> Registro, Login y obtención de datos de un usuario
// Auctions -> CRUD Subastas y emisión de eventos en tiempo real de Subastas
// Bids -> CRUD Pujas y emisión de eventos en tiempo real de pujas
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
