import gql from 'graphql-tag';

const typedef = gql`
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