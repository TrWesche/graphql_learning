import gql from 'graphql-tag';

const typedef = gql`
    enum UserOrderByInput {
        name_ASC,
        name_DESC
    }

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
        posts(count: Int, offset: Int, orderBy: PostOrderByInput): [Post!]!
        comments(count: Int, offset: Int, orderBy: CommentOrderByInput): [Comment!]!
    }

    type UserPublic implements User {
        _key: ID!
        name: String!
        posts(count: Int, offset: Int, orderBy: PostOrderByInput): [Post!]!
        comments(count: Int, offset: Int, orderBy: CommentOrderByInput): [Comment!]!
    }

    type UserPrivate implements User {
        _key: ID!
        name: String!
        email: String!
        age: Int
        updatedAt: TimeStampUnix!
        createdAt: TimeStampUnix!
        posts(count: Int, offset: Int, orderBy: PostOrderByInput): [Post!]!
        comments(count: Int, offset: Int, orderBy: CommentOrderByInput): [Comment!]!
    }
`;

export default typedef;