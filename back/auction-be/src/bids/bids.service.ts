import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateBidDto } from './dto/bids.dto';
import { AuctionGateway } from 'src/auction.gateway';

@Injectable()
export class BidsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly auctionGateway: AuctionGateway,
    ) { }

    async create(createBidDto: CreateBidDto) {
        const bid = await this.prisma.bid.create({
            data: {
                ...createBidDto,
                createdAt: new Date(),
            },
        });
        this.auctionGateway.sendBidUpdate(bid.id); // Emitir evento de nueva puja
        return bid;
    }
    
    async findAllByAuctionId(auctionId: number) {
        return this.prisma.bid.findMany({
            where: { auctionId },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async findOne(id: number) {
        const bid = await this.prisma.bid.findUnique({ where: { id } });
        if (!bid) {
            throw new NotFoundException(`Bid with ID ${id} not found`);
        }
        return bid;
    }

    async remove(id: number) {
        const bid = await this.prisma.bid.findUnique({ where: { id } });
        if (!bid) {
            throw new NotFoundException(`Bid with ID ${id} not found`);
        }
        return this.prisma.bid.delete({ where: { id } });
    }
}
