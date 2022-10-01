import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import React from 'react';

const Admin = () => {
  const user = useUser();

  console.log(user);

  return <div className="text-3xl">Admin {user.user?.nickname}</div>;
};

export default Admin;

export const getServerSideProps = withPageAuthRequired();
