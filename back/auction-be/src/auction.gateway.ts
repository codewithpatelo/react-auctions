import { WebSocketGateway, SubscribeMessage, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
@Injectable()
export class AuctionGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  // Emitir un evento de actualización de subasta
  sendAuctionUpdate(id: number, title: string, description: string, startingPrice: number, userId: number, endTime: Date) {
    this.server.emit('auctionUpdate', { id, title, description, startingPrice, userId, endTime });
  }


  // Emitir un evento de nueva puja
  sendBidUpdate(bidId: number, bidAmount: number, auctionId: number) {
    this.server.emit('bidUpdate', { id: bidId, amount: bidAmount, auctionId });
  }
}
