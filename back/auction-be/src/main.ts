import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { IoAdapter } from '@nestjs/platform-socket.io';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Configuración de express-session
  app.use(cookieParser());
  app.use(
    session({
      secret: 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcyMTk0MjY4OSwiaWF0IjoxNzIxOTQyNjg5fQ.lAcC311DkaaLlLQeyuDy_LxZbkKDmG0rBXFlQzKonKA',
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false },
    }),
  );
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // Configuración de Socket.IO con CORS
  app.useWebSocketAdapter(new IoAdapter(app));


  // Configuración de passport
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(4000);
}
bootstrap();
