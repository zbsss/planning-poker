import { GetServerSideProps } from 'next';
import React, { FC } from 'react';
import { useTableQuery } from '../../generated/graphql';

interface TableProps {
  tableId: string;
}

const Table: FC<TableProps> = ({ tableId }) => {
  const { data, loading, error } = useTableQuery({
    variables: {
      tableId,
    },
  });

  if (loading) return <>loading...</>;
  if (error) return <>Error: {JSON.stringify(error)}</>;
  return (
    <div>
      <pre>{JSON.stringify(data, null, 4)}</pre>
    </div>
  );
};

export default Table;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tableId = context.query.tableId;

  if (!tableId || typeof tableId !== 'string') {
    return {
      notFound: true,
    };
  }

  return {
    props: { tableId }, // will be passed to the page component as props
  };
};
