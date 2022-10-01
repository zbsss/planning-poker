import React from 'react';
import { useIncrementCounterMutation } from '../generated/graphql';

const IncrementCounterButton = () => {
  const [incrementCounter] = useIncrementCounterMutation();

  return (
    <button
      className="px-4 py-2 bg-blue-500 text-white rounded my-10"
      onClick={() => incrementCounter()}
    >
      Increment Counter
    </button>
  );
};

export default IncrementCounterButton;
