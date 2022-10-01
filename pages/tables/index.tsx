import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  useCreateTableMutation,
  useMyTablesQuery,
} from '../../generated/graphql';

type Inputs = {
  name: string;
};

const Tables = () => {
  const { data, loading, error } = useMyTablesQuery();

  const [createTable] = useCreateTableMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) =>
    createTable({ variables: data });

  if (loading) return <>loading...</>;
  if (error) return <>Error: {JSON.stringify(error)}</>;
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* include validation with required or other standard HTML validation rules */}
        <input {...register('name', { required: true })} />
        {/* errors will return when field validation fails  */}
        {errors.name && <span>This field is required</span>}

        <input type="submit" />
      </form>
      <h1 className="text-xxl3">My Tables</h1>
      <pre>{JSON.stringify(data?.tables, null, 2)}</pre>
    </div>
  );
};

export default Tables;

export const getServerSideProps = withPageAuthRequired();
