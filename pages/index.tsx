import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 space-y-3">
      <Head>
        <title>Next.js Template</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  );
}
