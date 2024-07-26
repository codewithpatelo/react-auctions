import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateAuctionDto, UpdateAuctionDto } from './dto/auctions.dto';
import { AuctionGateway } from '../auction.gateway';

@Injectable()
export class AuctionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auctionGateway: AuctionGateway,
  ) { }

  async create(createAuctionDto: CreateAuctionDto) {
    const { userId, startingPrice, endTime, ...restOfCreateAuctionDto } = createAuctionDto;

    // Ensure endTime is a valid ISO-8601 string
    const isoEndTime = new Date(endTime).toISOString();

    const auction = await this.prisma.auction.create({
      data: {
        ...restOfCreateAuctionDto,
        currentPrice: Number(startingPrice), // Set currentPrice to startingPrice
        startingPrice: Number(startingPrice), // Make sure startingPrice is included in the data
        endTime: isoEndTime, // Ensure endTime is a valid ISO-8601 string
        user: {
          connect: { id: userId }, // Connect the auction to the existing user
        },
      },
    });

    this.auctionGateway.sendAuctionUpdate(auction.id); // Emit event for new auction
    return auction;
  }

  async findAll() {
    return this.prisma.auction.findMany({
      where: {
        endTime: {
          gte: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const auction = await this.prisma.auction.findUnique({ where: { id } });
    if (!auction) {
      throw new NotFoundException(`Auction with ID ${id} not found`);
    }
    return auction;
  }

  async update(id: number, updateAuctionDto: UpdateAuctionDto) {
    const auction = await this.prisma.auction.update({
      where: { id },
      data: updateAuctionDto,
    });
    this.auctionGateway.sendAuctionUpdate(auction.id); // Emit event for auction update
    return auction;
  }

  async remove(id: number) {
    const auction = await this.prisma.auction.findUnique({ where: { id } });
    if (!auction) {
      throw new NotFoundException(`Auction with ID ${id} not found`);
    }
    return this.prisma.auction.delete({ where: { id } });
  }
}
