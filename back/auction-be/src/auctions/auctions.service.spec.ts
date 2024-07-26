// src/auctions/auctions.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuctionsService } from './auctions.service';
import { PrismaService } from '../prisma.service';
import { AuctionGateway } from '../auction.gateway';
import { CreateAuctionDto } from './dto/auctions.dto';

describe('AuctionsService', () => {
  let service: AuctionsService;
  let prisma: jest.Mocked<PrismaService>;
  let auctionGateway: jest.Mocked<AuctionGateway>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuctionsService,
        {
          provide: PrismaService,
          useValue: {
            auction: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        {
          provide: AuctionGateway,
          useValue: {
            sendAuctionUpdate: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuctionsService>(AuctionsService);
    prisma = module.get<PrismaService>(PrismaService) as jest.Mocked<PrismaService>;
    auctionGateway = module.get<AuctionGateway>(AuctionGateway) as jest.Mocked<AuctionGateway>;
  });

  describe('create', () => {
    it('should create an auction and emit an update event', async () => {
      const now = new Date();
      const createAuctionDto: CreateAuctionDto = {
        userId: 1,
        title: 'Auction 1',
        description: 'Description',
        startingPrice: 100,
        endTime: now,
        currentPrice: 100,
      };

      const auction = {
        id: 1,
        ...createAuctionDto,
        endTime: now.toISOString(), // Asegúrate de que endTime sea una cadena ISO aquí también
      };

      (prisma.auction.create as jest.Mock).mockResolvedValue(auction);

      await expect(service.create(createAuctionDto)).resolves.toEqual(auction);

      // Verifica que la llamada real a `prisma.auction.create` incluya `endTime` como cadena ISO
      expect(prisma.auction.create).toHaveBeenCalledWith({
        data: {
          title: createAuctionDto.title,
          description: createAuctionDto.description,
          startingPrice: createAuctionDto.startingPrice,
          currentPrice: createAuctionDto.currentPrice,
          endTime: createAuctionDto.endTime,
          user: {
            connect: { id: createAuctionDto.userId },
          },
        },
      });

      expect(auctionGateway.sendAuctionUpdate).toHaveBeenCalledWith(
        auction.id,
        auction.title,
        auction.description,
        auction.startingPrice,
        auction.userId,
        auction.endTime,
      );
    });
  });

  // Otras pruebas...
});
