import { WebSocketGateway, SubscribeMessage, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

@WebSocketGateway()
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
  sendAuctionUpdate(auctionId: number) {
    this.server.emit('auctionUpdate', { auctionId });
  }

  // Emitir un evento de nueva puja
  sendBidUpdate(bidId: number) {
    this.server.emit('bidUpdate', { bidId });
  }
}
