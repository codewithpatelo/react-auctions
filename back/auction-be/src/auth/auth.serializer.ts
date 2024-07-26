import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Injectable()
export class AuthSerializer extends PassportSerializer {
  constructor(private readonly authService: AuthService) {
    super();
  }

  // Serializaciones
  async serializeUser(
    user: any,
    done: (err: Error, user: any) => void,
  ): Promise<void> {
    console.log('Serializing user:', user);
    done(null, user.id);
  }

  async deserializeUser(
    payload: number,
    done: (err: Error, user: any) => void,
  ): Promise<void> {
    console.log('Deserializing user ID:', payload);
    try {
      const user = await this.authService.getProfile(payload);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }
}
