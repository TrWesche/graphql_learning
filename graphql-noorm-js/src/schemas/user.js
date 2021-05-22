import gql from 'graphql-tag';

const typedef = gql`
    input CreateUserInput {
        name: String!
        email: String!
        age: Int
    }

    input UpdateUserInput {
        name: String
        email: String
        age: Int
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }
`;

export default typedef;