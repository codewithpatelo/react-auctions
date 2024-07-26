// src/pages/_app.tsx
import { SessionProvider } from 'next-auth/react';
import '../styles/globals.css'; // Importa Tailwind CSS
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return <SessionProvider session={pageProps.session}><Component {...pageProps} /></SessionProvider>;
}

export default MyApp;
