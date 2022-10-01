import { useUser } from '@auth0/nextjs-auth0';
import React, { useEffect } from 'react';
import { useRegisterUserMutation } from '../generated/graphql';

// TODO: Remove this once we connect Auth0 webhook action to call /auth/hook
const RegisterMe = () => {
  const user = useUser();
  const [registerUser] = useRegisterUserMutation();

  useEffect(() => {
    if (user.user) {
      registerUser();
    }
  }, [user.user, registerUser]);

  return <></>;
};

export default RegisterMe;
