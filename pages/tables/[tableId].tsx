import { GetServerSideProps } from 'next';
import React, { FC } from 'react';
import {
  useTableQuery,
  useChooseCardMutation,
  useJoinTableMutation,
  usePlayerReadinessQuery,
  PlayerReadinessDocument,
  PlayerReadinessUpdatesDocument,
} from '../../generated/graphql';
import { PlayerReadinessUpdates } from '../../graphql/types';

interface TableProps {
  tableId: string;
}

const Table: FC<TableProps> = ({ tableId }) => {
  const { data, loading, error } = useTableQuery({
    variables: {
      tableId,
    },
  });

  const [chooseCard] = useChooseCardMutation();
  const [joinTable] = useJoinTableMutation({
    variables: { tableId },
  });

  const { data: readinessData, subscribeToMore } = usePlayerReadinessQuery({
    variables: {
      tableId,
    },
  });
  if (global.window) {
    subscribeToMore({
      document: PlayerReadinessUpdatesDocument,
      variables: {
        tableId,
      },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        const events = [...prev.playerReadiness];

        for (const newEvent of subscriptionData.data.playerReadiness) {
          const idx = events.findIndex((e) => e.userId === newEvent.userId);

          if (idx !== -1) {
            events[idx] = newEvent;
          } else {
            events.push(newEvent);
          }
        }

        return { playerReadiness: events };
      },
    });
  }

  if (loading) return <>loading...</>;
  if (error) return <>Error: {JSON.stringify(error)}</>;
  return (
    <div>
      <div>
        <pre>{JSON.stringify(readinessData?.playerReadiness)}</pre>
      </div>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded my-10 m-7"
        onClick={() =>
          chooseCard({
            variables: {
              tableId,
              card: null,
            },
          })
        }
      >
        null
      </button>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded my-10 m-7"
        onClick={() =>
          chooseCard({
            variables: {
              tableId,
              card: '1',
            },
          })
        }
      >
        1
      </button>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded my-10"
        onClick={() =>
          chooseCard({
            variables: {
              tableId,
              card: '2',
            },
          })
        }
      >
        2
      </button>
      <button
        className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0"
        onClick={() => joinTable()}
      >
        Join Table
      </button>
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
