import { NestFactory } from '@nestjs/core';
import 'reflect-metadata';
import { AppModule } from './app.module';

import cookieParser from 'cookie-parser';
import csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const isProd = process.env.NODE_ENV === 'production';

  app.enableCors({
    origin: process.env.FRONTEND_ORIGIN || true,
    credentials: true,
  });

  app.use(cookieParser());

  const csrfMiddleware = csurf({
    cookie: {
      httpOnly: true,
      secure: isProd,
      ...(isProd ? { sameSite: 'none' } : {}),
    },
  });

  app.use((req: any, res: any, next: any) => {
    if (req.path.startsWith('/auth/')) {
      return next();
    }
    return csrfMiddleware(req, res, next);
  });

  app.use((req: any, res: any, next: any) => {
    if (req.path.startsWith('/auth/')) {
      return next();
    }

    const token = req.csrfToken();
    res.cookie('XSRF-TOKEN', token, {
      secure: isProd,
      ...(isProd ? { sameSite: 'none' } : {}),
    });

    next();
  });

  await app.listen(process.env.PORT || 3000);
  console.log(`API on http://localhost:${process.env.PORT || 3000}`);
}

bootstrap();
