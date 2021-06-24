import gql from 'graphql-tag';

const typedef = gql`
    type Mutation {
        createUser(data: CreateUserInput!): UserPrivate!
        loginUser(data: LoginUserInput!): UserPrivate!
        deleteUser: UserPrivate!
        logoutUser: String!
        updateUser(data: UpdateUserInput!): UserPrivate!
        createPost(data: CreatePostInput!): Post!
        updatePost(post_key: ID!, data: UpdatePostInput!): Post!
        deletePost(post_key: ID!): Post!
        createComment(data: CreateCommentInput!): Comment!
        updateComment(comment_key: ID!, data: UpdateCommentInput!): Comment!
        deleteComment(comment_key: ID!): Comment!
    }
`;

export default typedef;