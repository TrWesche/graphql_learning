import gql from 'graphql-tag';

const typedef = gql`
    input CreatePostInput {
        title: String!
        body: String!
        published: Boolean!
        author_id: ID!
    }

    input UpdatePostInput {
        title: String
        body: String
        published: Boolean
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }
`;

export default typedef;