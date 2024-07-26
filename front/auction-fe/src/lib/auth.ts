// src/lib/auth.ts
import { IncomingMessage } from 'http';
import { parseCookies } from 'nookies';

export const isAuthenticated = (ctx: { req: IncomingMessage }) => {
  const cookies = parseCookies(ctx);
  return Boolean(cookies.token);
};
