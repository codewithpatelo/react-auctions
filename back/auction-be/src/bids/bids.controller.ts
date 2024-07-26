import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { BidsService } from './bids.service';
import { CreateBidDto } from './dto/bids.dto';

@Controller('auctions/:auctionId/bids')
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}

  @Post()
  create(@Body() createBidDto: CreateBidDto) {
    return this.bidsService.create(createBidDto);
  }

  @Get()
  findAllByAuctionId(@Param('auctionId') auctionId: string) {
    return this.bidsService.findAllByAuctionId(+auctionId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bidsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bidsService.remove(+id);
  }
}
