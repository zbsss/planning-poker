// import Head from 'next/head';
// import { useEffect, useState } from 'react';
// import IncrementCounterButton from '../components/IncrementCounterButton';
// import { useLiveCounterSubscription } from '../generated/graphql';

// export default function Home() {
//   const [count, setCount] = useState<number>();

//   const { data, loading, error } = useLiveCounterSubscription();

//   /**
//    * Whenever the subscription looses connection it returns data === undefined
//    * so to keep the last legit result we need to store it in the state.
//    *
//    * Better solution would be to use the Apollo Cache
//    * but I couldn't figure out how to use it with subscriptions.
//    */
//   useEffect(() => {
//     if (data) {
//       setCount(data.counter.count);
//     }
//   }, [data]);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Oh no... {error.message}</p>;
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen py-2 space-y-3">
//       <Head>
//         <title>Next.js Template</title>
//         <link rel="icon" href="/favicon.ico" />
//       </Head>
//       <h1>{JSON.stringify(count)}</h1>
//       <IncrementCounterButton />
//     </div>
//   );
// }
