import gql from 'graphql-tag';

const typedef = gql`
    type Subscription {
        comment(post_id: ID!): CommentSubScriptionPayload!
        post: PostSubscriptionPayload!
    }

    type PostSubscriptionPayload {
        mutation: MutationType!
        data: Post!
    }

    type CommentSubScriptionPayload {
        mutation: MutationType!
        data: Comment!
    }
`;

export default typedef;