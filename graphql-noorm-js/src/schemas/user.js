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

    type User {
        _key: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }
`;

export default typedef;