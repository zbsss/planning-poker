// import Head from 'next/head';
// import IncrementCounterButton from '../components/IncrementCounterButton';
// import { LiveCounterDocument, useCounterQuery } from '../generated/graphql';

// export default function Home() {
//   const { data, loading, error, subscribeToMore } = useCounterQuery();

//   if (global.window) {
//     subscribeToMore({
//       document: LiveCounterDocument,
//       updateQuery: (prev, { subscriptionData }) => {
//         if (!subscriptionData.data) return prev;
//         return subscriptionData.data;
//       },
//     });
//   }

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Oh no... {error.message}</p>;
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen py-2 space-y-3">
//       <Head>
//         <title>Next.js Template</title>
//         <link rel="icon" href="/favicon.ico" />
//       </Head>
//       <h1>{JSON.stringify(data)}</h1>
//       <IncrementCounterButton />
//     </div>
//   );
// }
