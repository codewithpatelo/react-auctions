import { Controller, Post, Body, Req, Res } from '@nestjs/common';

import { Request, Response } from 'express';
import { AuthService } from './auth.servide';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string, password: string }, @Res() res: Response) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      return res.status(401).send('Invalid credentials');
    }
    const token = await this.authService.login(user);
    res.cookie('access_token', token.access_token, { httpOnly: true });
    res.send('Logged in');
  }

  @Post('register')
  async register(@Body() body: { email: string, password: string }) {
    await this.authService.register(body.email, body.password);
    return 'User registered';
  }
}
