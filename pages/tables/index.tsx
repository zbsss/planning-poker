import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import Link from 'next/link';
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import Avatar from '../../components/Avatar';
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
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) =>
    createTable({
      variables: data,
      update(cache, { data }) {
        cache.modify({
          fields: {
            tables(oldTables) {
              return [data?.createTable, ...oldTables];
            },
          },
        });
      },
    });

  if (loading) return <>loading...</>;
  if (error) return <>Error: {JSON.stringify(error)}</>;
  return (
    <>
      {/* My Tables */}
      <div className="container mx-auto p-6 grid grid-cols-4 gap-4">
        <h1 className="col-span-4 text-3xl text-center mb-4">My Tables</h1>
        {data?.tables.map((table) => (
          <Link
            className="w-full h-full"
            key={table.id}
            href={`/tables/${table.id}`}
          >
            <a className="w-full h-full group  block max-w-xs mx-auto rounded-lg p-6 bg-white ring-1 ring-slate-900/5 shadow-lg space-y-3 hover:bg-blue-400 hover:ring-sky-500">
              <h3 className="w-full text-center text-lg text-slate-900 group-hover:text-white font-semibold">
                {table.name}
              </h3>
              <div className="flex flex-row space-x-2 justify-center">
                {table.players.map((player) => (
                  <Avatar
                    key={player.userProfile.email}
                    image={player.userProfile.image || undefined}
                    name={player.userProfile.name}
                  />
                ))}
              </div>
            </a>
          </Link>
        ))}
      </div>

      <div className="h-10 w-full max-w-xs">
        <form onSubmit={handleSubmit(onSubmit)} className="px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-lg font-bold mb-2">
              Create New Table
            </label>
            <input
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              {...register('name', { required: true })}
            />
          </div>
          {errors.name && (
            <span className="text-red-500 text-xs italic">
              This field is required
            </span>
          )}

          <input
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 hover:ring-sky-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          />
        </form>
      </div>
    </>
  );
};

export default Tables;

export const getServerSideProps = withPageAuthRequired();
