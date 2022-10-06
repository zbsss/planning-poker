import { GetServerSideProps } from 'next';
import React, { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useJoinTableMutation } from '../generated/graphql';

interface ShareProps {
  token: string;
}

const Share: FC<ShareProps> = ({ token }) => {
  const router = useRouter();

  const [url, setUrl] = useState<string>();

  const [joinTable, { loading, error }] = useJoinTableMutation({
    variables: { token },
    onCompleted: (data) => {
      setUrl(data.joinTable.url);
    },
  });

  useEffect(() => {
    joinTable();
  }, [joinTable]);

  useEffect(() => {
    if (url) {
      router.push(url);
    }
  }, [router, url]);

  if (loading) return <>loading...</>;
  if (error) return <>Error: {JSON.stringify(error)}</>;
  return <>Sharing...</>;
};

export default Share;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = context.query.token;

  if (!token && typeof token === 'string') {
    return {
      notFound: true,
    };
  }

  return {
    props: { token }, // will be passed to the page component as props
  };
};
