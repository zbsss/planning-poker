/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import type { Context } from "./../graphql/context"
import type { core, connectionPluginCore } from "nexus"

declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    /**
     * Adds a Relay-style connection to the type, with numerous options for configuration
     *
     * @see https://nexusjs.org/docs/plugins/connection
     */
    connectionField<FieldName extends string>(
      fieldName: FieldName,
      config: connectionPluginCore.ConnectionFieldConfig<TypeName, FieldName>
    ): void
  }
}


declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
}

export interface NexusGenEnums {
  PlayerRole: "ADMIN" | "PLAYER"
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
}

export interface NexusGenObjects {
  Card: { // root type
    chosenCard?: string | null; // String
  }
  Mutation: {};
  Player: { // root type
    chosenCard?: string | null; // String
    role: NexusGenEnums['PlayerRole']; // PlayerRole!
    tableId: string; // String!
    userId: string; // String!
  }
  Query: {};
  Readiness: { // root type
    chosenCard?: string | null; // String
    isReady: boolean; // Boolean!
    user: NexusGenRootTypes['UserProfile']; // UserProfile!
  }
  Subscription: {};
  Table: { // root type
    id: string; // String!
    name: string; // String!
    revealAt?: string | null; // String
  }
  Url: { // root type
    url: string; // String!
  }
  UserProfile: { // root type
    email: string; // String!
    id: string; // String!
    image?: string | null; // String
    name: string; // String!
  }
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars & NexusGenEnums

export interface NexusGenFieldTypes {
  Card: { // field return type
    chosenCard: string | null; // String
  }
  Mutation: { // field return type
    chooseCard: NexusGenRootTypes['Card']; // Card!
    createTable: NexusGenRootTypes['Table']; // Table!
    hideCards: NexusGenRootTypes['Table']; // Table!
    joinTable: NexusGenRootTypes['Url']; // Url!
    registerUser: NexusGenRootTypes['UserProfile']; // UserProfile!
    revealCards: NexusGenRootTypes['Table']; // Table!
  }
  Player: { // field return type
    chosenCard: string | null; // String
    role: NexusGenEnums['PlayerRole']; // PlayerRole!
    tableId: string; // String!
    userId: string; // String!
    userProfile: NexusGenRootTypes['UserProfile']; // UserProfile!
  }
  Query: { // field return type
    playerReadiness: NexusGenRootTypes['Readiness'][]; // [Readiness!]!
    share: NexusGenRootTypes['Url']; // Url!
    table: NexusGenRootTypes['Table']; // Table!
    tables: NexusGenRootTypes['Table'][]; // [Table!]!
  }
  Readiness: { // field return type
    chosenCard: string | null; // String
    isReady: boolean; // Boolean!
    user: NexusGenRootTypes['UserProfile']; // UserProfile!
  }
  Subscription: { // field return type
    playerReadiness: NexusGenRootTypes['Readiness'][]; // [Readiness!]!
  }
  Table: { // field return type
    id: string; // String!
    name: string; // String!
    players: NexusGenRootTypes['Player'][]; // [Player!]!
    revealAt: string | null; // String
  }
  Url: { // field return type
    url: string; // String!
  }
  UserProfile: { // field return type
    email: string; // String!
    id: string; // String!
    image: string | null; // String
    name: string; // String!
  }
}

export interface NexusGenFieldTypeNames {
  Card: { // field return type name
    chosenCard: 'String'
  }
  Mutation: { // field return type name
    chooseCard: 'Card'
    createTable: 'Table'
    hideCards: 'Table'
    joinTable: 'Url'
    registerUser: 'UserProfile'
    revealCards: 'Table'
  }
  Player: { // field return type name
    chosenCard: 'String'
    role: 'PlayerRole'
    tableId: 'String'
    userId: 'String'
    userProfile: 'UserProfile'
  }
  Query: { // field return type name
    playerReadiness: 'Readiness'
    share: 'Url'
    table: 'Table'
    tables: 'Table'
  }
  Readiness: { // field return type name
    chosenCard: 'String'
    isReady: 'Boolean'
    user: 'UserProfile'
  }
  Subscription: { // field return type name
    playerReadiness: 'Readiness'
  }
  Table: { // field return type name
    id: 'String'
    name: 'String'
    players: 'Player'
    revealAt: 'String'
  }
  Url: { // field return type name
    url: 'String'
  }
  UserProfile: { // field return type name
    email: 'String'
    id: 'String'
    image: 'String'
    name: 'String'
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    chooseCard: { // args
      card?: string | null; // String
      tableId: string; // String!
    }
    createTable: { // args
      name: string; // String!
    }
    hideCards: { // args
      tableId: string; // String!
    }
    joinTable: { // args
      token: string; // String!
    }
    revealCards: { // args
      tableId: string; // String!
    }
  }
  Query: {
    playerReadiness: { // args
      tableId: string; // String!
    }
    share: { // args
      tableId: string; // String!
    }
    table: { // args
      id: string; // String!
    }
  }
  Subscription: {
    playerReadiness: { // args
      tableId: string; // String!
    }
  }
}

export interface NexusGenAbstractTypeMembers {
}

export interface NexusGenTypeInterfaces {
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = never;

export type NexusGenEnumNames = keyof NexusGenEnums;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = never;

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

export interface NexusGenTypes {
  context: Context;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
    
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}