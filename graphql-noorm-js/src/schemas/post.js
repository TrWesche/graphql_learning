import gql from 'graphql-tag';

const typedef = gql`
    input CreatePostInput {
        title: String!
        body: String!
        published: Boolean!
    }

    input UpdatePostInput {
        title: String
        body: String
        published: Boolean
    }

    type Post {
        _key: ID!
        title: String!
        body: String!
        published: Boolean!
        author: UserPublic!
        comments: [Comment!]!
    }
`;

export default typedef;