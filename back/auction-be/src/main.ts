import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { IoAdapter } from '@nestjs/platform-socket.io';

// Invocamos variables ambientales
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Configuración básica de express-session
  app.use(cookieParser());
  app.use(
    session({
      secret:
        'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcyMTk0MjY4OSwiaWF0IjoxNzIxOTQyNjg5fQ.lAcC311DkaaLlLQeyuDy_LxZbkKDmG0rBXFlQzKonKA',
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false },
    }),
  );
  // Definimos el prefijo de la api
  app.setGlobalPrefix('api');
  // Configuramos CORS para evitar problemas de bloqueo
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // Configuramos Socket.IO con CORS
  app.useWebSocketAdapter(new IoAdapter(app));

  // Configuramos passport para la autentificación
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(4000);
}
bootstrap();
