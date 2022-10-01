import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import React from 'react';

const Admin = () => {
  return <div>Admin</div>;
};

export default Admin;

export const getServerSideProps = withPageAuthRequired();
