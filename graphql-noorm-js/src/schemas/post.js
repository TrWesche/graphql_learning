import gql from 'graphql-tag';

const typedef = gql`
    enum PostOrderByInput {
        title_ASC,
        title_DESC,
        createdAt_ASC,
        createdAt_DESC,
        updatedAt_ASC,
        updatedAt_DESC
    }

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
        updatedAt: TimeStampUnix!
        createdAt: TimeStampUnix!
        comments(count: Int, offset: Int): [Comment!]!
    }
`;

export default typedef;