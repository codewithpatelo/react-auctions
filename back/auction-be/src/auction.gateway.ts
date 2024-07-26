// Aca generaremos el servidor de socket para transmitir información en tiempo real al FE
import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

// Debemos configurar CORS para evitar bloqueos de los mensajes
@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
@Injectable()
export class AuctionGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
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

  // Si se actualiza una subasta, emitimos un evento de actualización de subasta
  sendAuctionUpdate(
    id: number,
    title: string,
    description: string,
    startingPrice: number,
    userId: number,
    endTime: Date,
  ) {
    this.server.emit('auctionUpdate', {
      id,
      title,
      description,
      startingPrice,
      userId,
      endTime,
    });
  }

  // Si se actualiza una puja, emitimos un evento de nueva puja
  sendBidUpdate(bidId: number, bidAmount: number, auctionId: number) {
    this.server.emit('bidUpdate', { id: bidId, amount: bidAmount, auctionId });
  }
}
