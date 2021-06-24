import gql from 'graphql-tag';

const typedef = gql`
    enum CommentOrderByInput {
        createdAt_ASC,
        createdAt_DESC,
        updatedAt_ASC,
        updatedAt_DESC
    }

    input CreateCommentInput {
        text: String!
        post_key: ID!
    }

    input UpdateCommentInput {
        text: String
    }

    type Comment {
        _key: ID!
        text: String!
        updatedAt: TimeStampUnix!
        createdAt: TimeStampUnix!
        author: UserPublic!
        post: Post
    }
`;

export default typedef;