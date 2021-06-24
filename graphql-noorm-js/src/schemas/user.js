import gql from 'graphql-tag';

const typedef = gql`
    input CreateUserInput {
        name: String!
        email: String!
        password: String!
        age: Int
    }

    input LoginUserInput {
        email: String!
        password: String!
    }

    input UpdateUserInput {
        name: String
        email: String
        password: String
        age: Int
    }

    interface User {
        _key: ID!
        name: String!
        posts(count: Int, offset: Int): [Post!]!
        comments(count: Int, offset: Int): [Comment!]!
    }

    type UserPublic implements User {
        _key: ID!
        name: String!
        posts(count: Int, offset: Int): [Post!]!
        comments(count: Int, offset: Int): [Comment!]!
    }

    type UserPrivate implements User {
        _key: ID!
        name: String!
        email: String!
        age: Int
        updatedAt: TimeStampUnix!
        createdAt: TimeStampUnix!
        posts(count: Int, offset: Int): [Post!]!
        comments(count: Int, offset: Int): [Comment!]!
    }
`;

export default typedef;