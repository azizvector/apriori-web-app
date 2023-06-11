import '@/styles/globals.css';
import 'react-datetime/css/react-datetime.css';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import type { ReactNode } from 'react';
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
});

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: JSX.Element) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout): JSX.Element {
  const getLayout = Component.getLayout ?? (page => page);
  return (
    <div className={poppins.className}>
      {getLayout(<Component {...pageProps} />)}
    </div>
  );
}
