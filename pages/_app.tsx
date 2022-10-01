import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import apolloClient from '../lib/apollo';
import { UserProvider } from '@auth0/nextjs-auth0';
import Header from '../components/Layout/Header';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <ApolloProvider client={apolloClient}>
        <Header />
        <Component {...pageProps} />
      </ApolloProvider>
    </UserProvider>
  );
}

export default MyApp;
