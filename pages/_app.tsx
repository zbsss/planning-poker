import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import apolloClient from '../lib/apollo';
import { UserProvider } from '@auth0/nextjs-auth0';
import RegisterMe from '../components/Me';
import Layout from '../components/Layout/Layout';
import Header from '../components/Layout/Header';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <ApolloProvider client={apolloClient}>
        <RegisterMe />
        <Layout>
          <Header />
          <Component {...pageProps} />
        </Layout>
      </ApolloProvider>
    </UserProvider>
  );
}

export default MyApp;
