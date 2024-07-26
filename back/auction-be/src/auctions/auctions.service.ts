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

    // Asegúrate de que endTime sea un objeto Date
    const formattedEndTime = new Date(endTime);

    const auction = await this.prisma.auction.create({
      data: {
        ...restOfCreateAuctionDto,
        currentPrice: Number(startingPrice), // Asegúrate de que currentPrice sea un número
        startingPrice: Number(startingPrice), // Asegúrate de que startingPrice sea un número
        endTime: formattedEndTime, // Usa el objeto Date para endTime
        user: {
          connect: { id: userId }, // Conecta la subasta con el usuario existente
        },
      },
    });

    this.auctionGateway.sendAuctionUpdate(auction.id, auction.title, auction.description, auction.startingPrice, auction.userId, auction.endTime); // Emite el evento para la nueva subasta
    return auction;
  }

  async findAll() {
    return this.prisma.auction.findMany({
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
    this.auctionGateway.sendAuctionUpdate(auction.id, auction.title, auction.description, auction.startingPrice, auction.userId, auction.endTime); // Emite el evento para la actualización de la subasta
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
