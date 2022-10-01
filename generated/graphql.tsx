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

export type Player = {
  __typename?: 'Player';
  chosenCard?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  role: PlayerRole;
  userProfile: UserProfile;
};

export enum PlayerRole {
  Admin = 'ADMIN',
  Player = 'PLAYER'
}

export type Query = {
  __typename?: 'Query';
  table: Table;
};


export type QueryTableArgs = {
  id: Scalars['String'];
};

export type Table = {
  __typename?: 'Table';
  id: Scalars['String'];
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


export type TableQuery = { __typename?: 'Query', table: { __typename?: 'Table', id: string, revealAt?: string | null, players: Array<{ __typename?: 'Player', id: string, chosenCard?: string | null, role: PlayerRole, userProfile: { __typename?: 'UserProfile', id: string, name: string, email?: string | null, image?: string | null } }> } };


export const TableDocument = gql`
    query Table($tableId: String!) {
  table(id: $tableId) {
    id
    revealAt
    players {
      id
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