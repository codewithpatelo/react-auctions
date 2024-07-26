// lib/auth.ts

import nookies from 'nookies';

export const isAuthenticated = (ctx: any) => {
  const cookies = nookies.get(ctx);
  return cookies.token !== undefined;
};
