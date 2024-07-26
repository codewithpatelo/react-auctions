import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    // Aca normalmente haremos un modelo de respuesta tipado
    // Se valida usuario primero
    console.log('Validating user:', email);
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    console.log('Logging in user:', user);
    const payload = { email: user.email, sub: user.id };
    // Obtenemos token e id de usuario
    return {
      access_token: this.jwtService.sign(payload),
      user_id: user.id,
    };
  }

  async register(email: string, password: string) {
    console.log('Registering user:', email);
    // Primero validar existencia de usuario
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new Error('User already exists');
    }
    // Crucial hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Procedemos a crear usuario
    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
  }

  async getProfile(id: number) {
    // Este servicio será consumido por el dashboard
    console.log('Getting profile for user ID:', id);
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}
