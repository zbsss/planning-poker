import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Card = {
  __typename?: 'Card';
  chosenCard?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  chooseCard: Card;
  createTable: Table;
  joinTable: Player;
  registerUser: UserProfile;
};


export type MutationChooseCardArgs = {
  card?: InputMaybe<Scalars['String']>;
  tableId: Scalars['String'];
};


export type MutationCreateTableArgs = {
  name: Scalars['String'];
};


export type MutationJoinTableArgs = {
  tableId: Scalars['String'];
};

export type Player = {
  __typename?: 'Player';
  chosenCard?: Maybe<Scalars['String']>;
  role: PlayerRole;
  tableId: Scalars['String'];
  userId: Scalars['String'];
  userProfile: UserProfile;
};

export enum PlayerRole {
  Admin = 'ADMIN',
  Player = 'PLAYER'
}

export type Query = {
  __typename?: 'Query';
  playerReadiness: Array<Readiness>;
  table: Table;
  tables: Array<Table>;
};


export type QueryPlayerReadinessArgs = {
  tableId: Scalars['String'];
};


export type QueryTableArgs = {
  id: Scalars['String'];
};

export type Readiness = {
  __typename?: 'Readiness';
  isReady: Scalars['Boolean'];
  userId: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  playerReadiness: Array<Readiness>;
};


export type SubscriptionPlayerReadinessArgs = {
  tableId: Scalars['String'];
};

export type Table = {
  __typename?: 'Table';
  id: Scalars['String'];
  name: Scalars['String'];
  players: Array<Player>;
  revealAt?: Maybe<Scalars['String']>;
};

export type UserProfile = {
  __typename?: 'UserProfile';
  email?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  image?: Maybe<Scalars['String']>;
  name: Scalars['String'];
};

export type TableQueryVariables = Exact<{
  tableId: Scalars['String'];
}>;


export type TableQuery = { __typename?: 'Query', table: { __typename?: 'Table', id: string, name: string, revealAt?: string | null, players: Array<{ __typename?: 'Player', chosenCard?: string | null, role: PlayerRole, userProfile: { __typename?: 'UserProfile', id: string, name: string, email?: string | null, image?: string | null } }> } };

export type MyTablesQueryVariables = Exact<{ [key: string]: never; }>;


export type MyTablesQuery = { __typename?: 'Query', tables: Array<{ __typename?: 'Table', id: string, name: string, players: Array<{ __typename?: 'Player', role: PlayerRole, userProfile: { __typename?: 'UserProfile', name: string, email?: string | null, image?: string | null } }> }> };

export type CreateTableMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type CreateTableMutation = { __typename?: 'Mutation', createTable: { __typename?: 'Table', id: string, name: string, players: Array<{ __typename?: 'Player', role: PlayerRole, userProfile: { __typename?: 'UserProfile', id: string, name: string, image?: string | null, email?: string | null } }> } };

export type JoinTableMutationVariables = Exact<{
  tableId: Scalars['String'];
}>;


export type JoinTableMutation = { __typename?: 'Mutation', joinTable: { __typename?: 'Player', role: PlayerRole } };

export type ChooseCardMutationVariables = Exact<{
  tableId: Scalars['String'];
  card?: InputMaybe<Scalars['String']>;
}>;


export type ChooseCardMutation = { __typename?: 'Mutation', chooseCard: { __typename?: 'Card', chosenCard?: string | null } };

export type RegisterUserMutationVariables = Exact<{ [key: string]: never; }>;


export type RegisterUserMutation = { __typename?: 'Mutation', registerUser: { __typename?: 'UserProfile', id: string, name: string, email?: string | null, image?: string | null } };

export type PlayerReadinessQueryVariables = Exact<{
  tableId: Scalars['String'];
}>;


export type PlayerReadinessQuery = { __typename?: 'Query', playerReadiness: Array<{ __typename?: 'Readiness', userId: string, isReady: boolean }> };

export type PlayerReadinessUpdatesSubscriptionVariables = Exact<{
  tableId: Scalars['String'];
}>;


export type PlayerReadinessUpdatesSubscription = { __typename?: 'Subscription', playerReadiness: Array<{ __typename?: 'Readiness', userId: string, isReady: boolean }> };


export const TableDocument = gql`
    query Table($tableId: String!) {
  table(id: $tableId) {
    id
    name
    revealAt
    players {
      chosenCard
      role
      userProfile {
        id
        name
        email
        image
      }
    }
  }
}
    `;

/**
 * __useTableQuery__
 *
 * To run a query within a React component, call `useTableQuery` and pass it any options that fit your needs.
 * When your component renders, `useTableQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTableQuery({
 *   variables: {
 *      tableId: // value for 'tableId'
 *   },
 * });
 */
export function useTableQuery(baseOptions: Apollo.QueryHookOptions<TableQuery, TableQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TableQuery, TableQueryVariables>(TableDocument, options);
      }
export function useTableLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TableQuery, TableQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TableQuery, TableQueryVariables>(TableDocument, options);
        }
export type TableQueryHookResult = ReturnType<typeof useTableQuery>;
export type TableLazyQueryHookResult = ReturnType<typeof useTableLazyQuery>;
export type TableQueryResult = Apollo.QueryResult<TableQuery, TableQueryVariables>;
export const MyTablesDocument = gql`
    query MyTables {
  tables {
    id
    name
    players {
      role
      userProfile {
        name
        email
        image
      }
    }
  }
}
    `;

/**
 * __useMyTablesQuery__
 *
 * To run a query within a React component, call `useMyTablesQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyTablesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyTablesQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyTablesQuery(baseOptions?: Apollo.QueryHookOptions<MyTablesQuery, MyTablesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyTablesQuery, MyTablesQueryVariables>(MyTablesDocument, options);
      }
export function useMyTablesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyTablesQuery, MyTablesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyTablesQuery, MyTablesQueryVariables>(MyTablesDocument, options);
        }
export type MyTablesQueryHookResult = ReturnType<typeof useMyTablesQuery>;
export type MyTablesLazyQueryHookResult = ReturnType<typeof useMyTablesLazyQuery>;
export type MyTablesQueryResult = Apollo.QueryResult<MyTablesQuery, MyTablesQueryVariables>;
export const CreateTableDocument = gql`
    mutation CreateTable($name: String!) {
  createTable(name: $name) {
    id
    name
    players {
      role
      userProfile {
        id
        name
        image
        email
      }
    }
  }
}
    `;
export type CreateTableMutationFn = Apollo.MutationFunction<CreateTableMutation, CreateTableMutationVariables>;

/**
 * __useCreateTableMutation__
 *
 * To run a mutation, you first call `useCreateTableMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTableMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTableMutation, { data, loading, error }] = useCreateTableMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateTableMutation(baseOptions?: Apollo.MutationHookOptions<CreateTableMutation, CreateTableMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTableMutation, CreateTableMutationVariables>(CreateTableDocument, options);
      }
export type CreateTableMutationHookResult = ReturnType<typeof useCreateTableMutation>;
export type CreateTableMutationResult = Apollo.MutationResult<CreateTableMutation>;
export type CreateTableMutationOptions = Apollo.BaseMutationOptions<CreateTableMutation, CreateTableMutationVariables>;
export const JoinTableDocument = gql`
    mutation JoinTable($tableId: String!) {
  joinTable(tableId: $tableId) {
    role
  }
}
    `;
export type JoinTableMutationFn = Apollo.MutationFunction<JoinTableMutation, JoinTableMutationVariables>;

/**
 * __useJoinTableMutation__
 *
 * To run a mutation, you first call `useJoinTableMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useJoinTableMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [joinTableMutation, { data, loading, error }] = useJoinTableMutation({
 *   variables: {
 *      tableId: // value for 'tableId'
 *   },
 * });
 */
export function useJoinTableMutation(baseOptions?: Apollo.MutationHookOptions<JoinTableMutation, JoinTableMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<JoinTableMutation, JoinTableMutationVariables>(JoinTableDocument, options);
      }
export type JoinTableMutationHookResult = ReturnType<typeof useJoinTableMutation>;
export type JoinTableMutationResult = Apollo.MutationResult<JoinTableMutation>;
export type JoinTableMutationOptions = Apollo.BaseMutationOptions<JoinTableMutation, JoinTableMutationVariables>;
export const ChooseCardDocument = gql`
    mutation ChooseCard($tableId: String!, $card: String) {
  chooseCard(tableId: $tableId, card: $card) {
    chosenCard
  }
}
    `;
export type ChooseCardMutationFn = Apollo.MutationFunction<ChooseCardMutation, ChooseCardMutationVariables>;

/**
 * __useChooseCardMutation__
 *
 * To run a mutation, you first call `useChooseCardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChooseCardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [chooseCardMutation, { data, loading, error }] = useChooseCardMutation({
 *   variables: {
 *      tableId: // value for 'tableId'
 *      card: // value for 'card'
 *   },
 * });
 */
export function useChooseCardMutation(baseOptions?: Apollo.MutationHookOptions<ChooseCardMutation, ChooseCardMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChooseCardMutation, ChooseCardMutationVariables>(ChooseCardDocument, options);
      }
export type ChooseCardMutationHookResult = ReturnType<typeof useChooseCardMutation>;
export type ChooseCardMutationResult = Apollo.MutationResult<ChooseCardMutation>;
export type ChooseCardMutationOptions = Apollo.BaseMutationOptions<ChooseCardMutation, ChooseCardMutationVariables>;
export const RegisterUserDocument = gql`
    mutation RegisterUser {
  registerUser {
    id
    name
    email
    image
  }
}
    `;
export type RegisterUserMutationFn = Apollo.MutationFunction<RegisterUserMutation, RegisterUserMutationVariables>;

/**
 * __useRegisterUserMutation__
 *
 * To run a mutation, you first call `useRegisterUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerUserMutation, { data, loading, error }] = useRegisterUserMutation({
 *   variables: {
 *   },
 * });
 */
export function useRegisterUserMutation(baseOptions?: Apollo.MutationHookOptions<RegisterUserMutation, RegisterUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterUserMutation, RegisterUserMutationVariables>(RegisterUserDocument, options);
      }
export type RegisterUserMutationHookResult = ReturnType<typeof useRegisterUserMutation>;
export type RegisterUserMutationResult = Apollo.MutationResult<RegisterUserMutation>;
export type RegisterUserMutationOptions = Apollo.BaseMutationOptions<RegisterUserMutation, RegisterUserMutationVariables>;
export const PlayerReadinessDocument = gql`
    query PlayerReadiness($tableId: String!) {
  playerReadiness(tableId: $tableId) {
    userId
    isReady
  }
}
    `;

/**
 * __usePlayerReadinessQuery__
 *
 * To run a query within a React component, call `usePlayerReadinessQuery` and pass it any options that fit your needs.
 * When your component renders, `usePlayerReadinessQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePlayerReadinessQuery({
 *   variables: {
 *      tableId: // value for 'tableId'
 *   },
 * });
 */
export function usePlayerReadinessQuery(baseOptions: Apollo.QueryHookOptions<PlayerReadinessQuery, PlayerReadinessQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PlayerReadinessQuery, PlayerReadinessQueryVariables>(PlayerReadinessDocument, options);
      }
export function usePlayerReadinessLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PlayerReadinessQuery, PlayerReadinessQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PlayerReadinessQuery, PlayerReadinessQueryVariables>(PlayerReadinessDocument, options);
        }
export type PlayerReadinessQueryHookResult = ReturnType<typeof usePlayerReadinessQuery>;
export type PlayerReadinessLazyQueryHookResult = ReturnType<typeof usePlayerReadinessLazyQuery>;
export type PlayerReadinessQueryResult = Apollo.QueryResult<PlayerReadinessQuery, PlayerReadinessQueryVariables>;
export const PlayerReadinessUpdatesDocument = gql`
    subscription PlayerReadinessUpdates($tableId: String!) {
  playerReadiness(tableId: $tableId) {
    userId
    isReady
  }
}
    `;

/**
 * __usePlayerReadinessUpdatesSubscription__
 *
 * To run a query within a React component, call `usePlayerReadinessUpdatesSubscription` and pass it any options that fit your needs.
 * When your component renders, `usePlayerReadinessUpdatesSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePlayerReadinessUpdatesSubscription({
 *   variables: {
 *      tableId: // value for 'tableId'
 *   },
 * });
 */
export function usePlayerReadinessUpdatesSubscription(baseOptions: Apollo.SubscriptionHookOptions<PlayerReadinessUpdatesSubscription, PlayerReadinessUpdatesSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<PlayerReadinessUpdatesSubscription, PlayerReadinessUpdatesSubscriptionVariables>(PlayerReadinessUpdatesDocument, options);
      }
export type PlayerReadinessUpdatesSubscriptionHookResult = ReturnType<typeof usePlayerReadinessUpdatesSubscription>;
export type PlayerReadinessUpdatesSubscriptionResult = Apollo.SubscriptionResult<PlayerReadinessUpdatesSubscription>;