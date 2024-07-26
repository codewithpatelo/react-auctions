// En este controlador tenemos todas las rutas requeridas para las autentificaciones
import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  Get,
  UseGuards,
} from '@nestjs/common';

import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res() res: Response,
  ) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      return res.status(401).send('Invalid credentials');
    }
    const auth = await this.authService.login(user);
    res.cookie('access_token', auth.access_token, { httpOnly: true });
    // Enviar el token en la respuesta como JSON
    res.json({ access_token: auth.access_token, user_id: auth.user_id });
  }

  @Post('sign-up')
  async register(@Body() body: { email: string; password: string }) {
    await this.authService.register(body.email, body.password);
    return 'User registered';
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard) // Usamos guardia de JWT
  async getProfile(@Req() req: Request) {
    // Anclamos al modelo correspondiente
    const userId = (req.user as User).id;
    return this.authService.getProfile(userId);
  }
}
