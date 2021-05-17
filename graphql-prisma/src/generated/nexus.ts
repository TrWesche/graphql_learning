/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import { Context } from "./../context"
import { core } from "nexus"
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    date<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "DateTime";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    date<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "DateTime";
  }
}


declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  CommentCreateInput: { // input type
    text: string; // String!
  }
  PostCreateInput: { // input type
    body?: string | null; // String
    published?: boolean | null; // Boolean
    title: string; // String!
  }
  PostOrderByUpdatedAtInput: { // input type
    updatedAt: NexusGenEnums['SortOrder']; // SortOrder!
  }
  PostUniqueInput: { // input type
    id?: string | null; // String
  }
  UserCreateInput: { // input type
    age?: number | null; // Int
    email: string; // String!
    name?: string | null; // String
    posts?: NexusGenInputs['PostCreateInput'][] | null; // [PostCreateInput!]
  }
  UserUniqueInput: { // input type
    email?: string | null; // String
    id?: string | null; // String
  }
}

export interface NexusGenEnums {
  SortOrder: "asc" | "desc"
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
  DateTime: any
}

export interface NexusGenObjects {
  Comment: { // root type
    id: string; // String!
    text?: string | null; // String
  }
  Mutation: {};
  Post: { // root type
    body?: string | null; // String
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    published: boolean; // Boolean!
    title: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    viewCount: number; // Int!
  }
  Query: {};
  User: { // root type
    age?: number | null; // Int
    email: string; // String!
    id: string; // String!
    name?: string | null; // String
  }
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars & NexusGenEnums

export interface NexusGenFieldTypes {
  Comment: { // field return type
    author: NexusGenRootTypes['User']; // User!
    id: string; // String!
    post: NexusGenRootTypes['Post']; // Post!
    text: string | null; // String
  }
  Mutation: { // field return type
    createComment: NexusGenRootTypes['Comment'] | null; // Comment
    createPost: NexusGenRootTypes['Post'] | null; // Post
    createUser: NexusGenRootTypes['User']; // User!
    deletePost: NexusGenRootTypes['Post'] | null; // Post
    incrementPostViewCount: NexusGenRootTypes['Post'] | null; // Post
    togglePublishPost: NexusGenRootTypes['Post'] | null; // Post
  }
  Post: { // field return type
    author: NexusGenRootTypes['User'] | null; // User
    body: string | null; // String
    comments: NexusGenRootTypes['Comment'][]; // [Comment!]!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    published: boolean; // Boolean!
    title: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    viewCount: number; // Int!
  }
  Query: { // field return type
    allPosts: NexusGenRootTypes['Post'][]; // [Post!]!
    allUsers: NexusGenRootTypes['User'][]; // [User!]!
    commentById: NexusGenRootTypes['Comment'] | null; // Comment
    postById: NexusGenRootTypes['Post'] | null; // Post
    postComments: Array<NexusGenRootTypes['Comment'] | null> | null; // [Comment]
    userById: NexusGenRootTypes['User'] | null; // User
    userNotPublished: Array<NexusGenRootTypes['Post'] | null> | null; // [Post]
    userPublished: Array<NexusGenRootTypes['Post'] | null> | null; // [Post]
  }
  User: { // field return type
    age: number | null; // Int
    email: string; // String!
    id: string; // String!
    name: string | null; // String
    posts: NexusGenRootTypes['Post'][]; // [Post!]!
  }
}

export interface NexusGenFieldTypeNames {
  Comment: { // field return type name
    author: 'User'
    id: 'String'
    post: 'Post'
    text: 'String'
  }
  Mutation: { // field return type name
    createComment: 'Comment'
    createPost: 'Post'
    createUser: 'User'
    deletePost: 'Post'
    incrementPostViewCount: 'Post'
    togglePublishPost: 'Post'
  }
  Post: { // field return type name
    author: 'User'
    body: 'String'
    comments: 'Comment'
    createdAt: 'DateTime'
    id: 'Int'
    published: 'Boolean'
    title: 'String'
    updatedAt: 'DateTime'
    viewCount: 'Int'
  }
  Query: { // field return type name
    allPosts: 'Post'
    allUsers: 'User'
    commentById: 'Comment'
    postById: 'Post'
    postComments: 'Comment'
    userById: 'User'
    userNotPublished: 'Post'
    userPublished: 'Post'
  }
  User: { // field return type name
    age: 'Int'
    email: 'String'
    id: 'String'
    name: 'String'
    posts: 'Post'
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    createComment: { // args
      authorId: string; // String!
      data: NexusGenInputs['CommentCreateInput']; // CommentCreateInput!
      postId: string; // String!
    }
    createPost: { // args
      authorId: string; // String!
      data: NexusGenInputs['PostCreateInput']; // PostCreateInput!
    }
    createUser: { // args
      data: NexusGenInputs['UserCreateInput']; // UserCreateInput!
    }
    deletePost: { // args
      id: string; // String!
    }
    incrementPostViewCount: { // args
      id: string; // String!
    }
    togglePublishPost: { // args
      id: string; // String!
    }
  }
  Query: {
    allPosts: { // args
      orderBy?: NexusGenInputs['PostOrderByUpdatedAtInput'] | null; // PostOrderByUpdatedAtInput
      searchString?: string | null; // String
      skip?: number | null; // Int
      take?: number | null; // Int
    }
    commentById: { // args
      id?: string | null; // String
    }
    postById: { // args
      id?: string | null; // String
    }
    postComments: { // args
      postUniqueInput: NexusGenInputs['PostUniqueInput']; // PostUniqueInput!
    }
    userById: { // args
      id?: string | null; // String
    }
    userNotPublished: { // args
      userUniqueInput: NexusGenInputs['UserUniqueInput']; // UserUniqueInput!
    }
    userPublished: { // args
      userUniqueInput: NexusGenInputs['UserUniqueInput']; // UserUniqueInput!
    }
  }
}

export interface NexusGenAbstractTypeMembers {
}

export interface NexusGenTypeInterfaces {
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = keyof NexusGenInputs;

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
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}