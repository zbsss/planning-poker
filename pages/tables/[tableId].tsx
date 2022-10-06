import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import React, { FC, useEffect, useMemo, useState } from 'react';
import {
  useTableQuery,
  useChooseCardMutation,
  useJoinTableMutation,
  usePlayerReadinessQuery,
  PlayerReadinessUpdatesDocument,
  useRevealCardsMutation,
  useHideCardsMutation,
} from '../../generated/graphql';
import Avatar from '../../components/Avatar';

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
  const [revealCards] = useRevealCardsMutation({
    variables: { tableId },
  });
  const [hideCards] = useHideCardsMutation({
    variables: { tableId },
  });
  const [joinTable] = useJoinTableMutation({
    variables: { tableId },
  });

  const { data: players, subscribeToMore } = usePlayerReadinessQuery({
    variables: {
      tableId,
    },
    onCompleted: (data) => {
      if (isInitialLoad) {
        setSelectedCard(
          data.playerReadiness.find((p) => p.user.email === user.user?.email)
            ?.chosenCard || null
        );
        setInitialLoad(false);
      }
    },
    fetchPolicy: 'network-only',
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
  const isUserPlaying = useMemo(
    () =>
      !!players?.playerReadiness.find((p) => p.user.email === user.user?.email),
    [players?.playerReadiness, user.user?.email]
  );
  const isEveryoneReady = useMemo(
    () => players?.playerReadiness.every((p) => p.isReady),
    [players?.playerReadiness]
  );
  const areCardsRevealed = useMemo(
    () => players?.playerReadiness.every((p) => !!p.chosenCard),
    [players?.playerReadiness]
  );

  const [isInitialLoad, setInitialLoad] = useState(true);
  const [selectedCard, setSelectedCard] = useState<string | null>();

  useEffect(() => {
    if (areCardsRevealed) {
      setSelectedCard(null);
    }
  }, [areCardsRevealed, setSelectedCard]);

  if (loading) return <>loading...</>;
  if (error) return <>Error: {JSON.stringify(error)}</>;
  return (
    <>
      <div className="flex justify-center space-x-4 mb-5">
        <h1 className="text-center text-2xl my-3">{data?.table.name}</h1>
        {isEveryoneReady && !areCardsRevealed && (
          <button
            className="bg-blue-500 hover:bg-blue-600 hover:ring-sky-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => revealCards()}
          >
            Reveal Cards
          </button>
        )}
        {areCardsRevealed && (
          <button
            className="bg-blue-500 hover:bg-blue-600 hover:ring-sky-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => hideCards()}
          >
            Start new voting
          </button>
        )}
      </div>
      <div className="grow flex flex-wrap justify-center mb-5">
        {players?.playerReadiness.map((player) => (
          <div className="w-100 h-70 p-3" key={player.user.id}>
            {areCardsRevealed ? (
              <div className="ring-slate-900/5 shadow-lg rounded-lg h-80 w-60 bg-gray-300 text-white text-4xl flex justify-center items-center">
                {player.chosenCard}
              </div>
            ) : (
              <div
                className={`ring-slate-900/5 shadow-lg rounded-lg h-80 w-60 ${
                  player.isReady ||
                  (player.user.email === user.user?.email && selectedCard)
                    ? 'bg-blue-400'
                    : 'bg-gray-300'
                }`}
              ></div>
            )}
            <div className="flex items-center space-x-4 mt-1">
              <div className="flex-shrink-0">
                <Avatar
                  image={player.user.image || undefined}
                  name={player.user.name}
                />
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
      <div className="grid grid-cols-7 max-w-max space-x-5 m-auto mb-[2%]">
        {isUserPlaying &&
          !areCardsRevealed &&
          cards.map((card) => (
            <button
              key={card}
              className={`justify-self-center shadow-md border-2 border-opacity-40 border- border-blue-400 rounded-lg h-60 w-40 px-4 py-2 text-white text-4xl ${
                card === selectedCard ? 'bg-blue-400' : 'bg-gray-300'
              }`}
              onClick={() => {
                const newCard = card === selectedCard ? null : card;

                setSelectedCard(newCard);
                chooseCard({
                  variables: {
                    tableId,
                    card: newCard,
                  },
                });
              }}
            >
              {card}
            </button>
          ))}
        {!isUserPlaying && (
          <button
            className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0"
            onClick={() => joinTable()}
          >
            Join Table
          </button>
        )}
      </div>
    </>
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
