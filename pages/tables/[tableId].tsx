import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import React, { FC, useEffect, useState } from 'react';
import {
  useTableQuery,
  useChooseCardMutation,
  useJoinTableMutation,
  usePlayerReadinessQuery,
  PlayerReadinessUpdatesDocument,
} from '../../generated/graphql';

interface TableProps {
  tableId: string;
}

const cards = ['0', '1', '2', '3', '5', '8', '?'];

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

  const { data: players, subscribeToMore } = usePlayerReadinessQuery({
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
          const idx = events.findIndex((e) => e.user.id === newEvent.user.id);

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

  const user = useUser();
  const isCurrentUserPlaying = !!players?.playerReadiness.find(
    (p) => p.user.email === user.user?.email
  );

  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  useEffect(() => {
    if (isCurrentUserPlaying) {
      chooseCard({
        variables: {
          tableId,
          card: selectedCard,
        },
      });
    }
  }, [tableId, selectedCard, chooseCard]);

  if (loading) return <>loading...</>;
  if (error) return <>Error: {JSON.stringify(error)}</>;
  return (
    <div>
      <h1 className="text-center text-2xl my-3">{data?.table.name}</h1>
      <div className="flex justify-center space-x-10">
        {players?.playerReadiness.map((player) => (
          <div className="w-100 h-70" key={player.user.id}>
            <div
              className={`rounded-lg h-80 w-60 ${
                player.isReady ||
                (player.user.email === user.user?.email && selectedCard)
                  ? 'bg-blue-400'
                  : 'bg-gray-300'
              }`}
            ></div>
            <div className="flex items-center space-x-4 mt-1">
              <div className="flex-shrink-0">
                {player.user.image ? (
                  <img
                    className="w-8 h-8 rounded-full"
                    src={player.user.image || undefined}
                    alt={`Avatar of ${player.user.name}`}
                  />
                ) : (
                  <div className="flex w-8 h-8 rounded-full justify-center items-center bg-gray-400 text-white">
                    {player.user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 truncate dark:text-black">
                  {player.user.name}
                </p>
                <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                  {player.user.email}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-20 flex justify-center">
        {isCurrentUserPlaying ? (
          cards.map((card) => (
            <button
              key={card}
              className={`rounded-lg h-60 w-40 px-4 py-2 text-white text-4xl my-10 m-7 ${
                card === selectedCard ? 'bg-blue-400' : 'bg-gray-300'
              }`}
              onClick={() => {
                card === selectedCard
                  ? setSelectedCard(null)
                  : setSelectedCard(card);
              }}
            >
              {card}
            </button>
          ))
        ) : (
          <button
            className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0"
            onClick={() => joinTable()}
          >
            Join Table
          </button>
        )}
      </div>
    </div>
  );
};

export default Table;

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async (context) => {
    const tableId = context.query.tableId;

    if (!tableId || typeof tableId !== 'string') {
      return {
        notFound: true,
      };
    }

    return {
      props: { tableId }, // will be passed to the page component as props
    };
  },
});
