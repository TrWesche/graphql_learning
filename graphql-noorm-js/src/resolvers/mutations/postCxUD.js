import { v4 as uuidV4 } from "uuid";

const resolvers = {
    createPost(parent, args, { db, pubsub }, info) {
        const userExists = db.users.some((user) => {
            return user.id === args.data.author_id;
        })

        if (!userExists) {
            throw new Error(`User not found.`)
        }

        const post = {
            id: uuidV4(),
            ...args.data
        }

        db.posts.push(post);

        if (post.published) {
            pubsub.publish('post',{ 
                post: {
                    mutation: 'CREATED',
                    data: post
                }
            });
        }

        return post;
    },
    updatePost(parent, args, { db, pubsub }, info) {
        const {post_id, data} = args;
        const post = db.posts.find(post => post.id === post_id);
        const originalPost = {...post};

        if (!post) {
            throw new Error(`Post not found`)
        }

        if (typeof data.title === 'string') {
            post.title = data.title;
        }

        if (typeof data.body === 'string') {
            post.body = data.body;
        }

        if (typeof data.published === 'boolean') {
            post.published = data.published;

            if (originalPost.published && !post.published) {
                pubsub.publish('post',{ 
                    post: {
                        mutation: 'DELETED',
                        data: originalPost
                    }
                });
            } else if (!originalPost.published && post.published) {
                pubsub.publish('post',{ 
                    post: {
                        mutation: 'CREATED',
                        data: post
                    }
                }); 
            } else if (originalPost.published && post.published) {
                pubsub.publish('post', {
                    post: {
                        mutation: 'UPDATED',
                        data: post
                    }
                })
            }
        } else if (post.published) {
            pubsub.publish('post',{ 
                post: {
                    mutation: 'UPDATED',
                    data: post
                }
            });
        }

        return post;
    },
    deletePost(parent, args, { db, pubsub }, info) {
        const postIndex = db.posts.findIndex(post => post.id === args.post_id);

        if (postIndex === -1) {
            throw new Error(`Post not found`)
        }

        const [post] = db.posts.splice(postIndex, 1);

        db.comments = db.comments.filter((comment) => {
            return comment.post_id !== args.post_id;
        })

        if (post.published) {
            pubsub.publish('post',{ 
                post: {
                    mutation: 'DELETED',
                    data: post
                }
            });
        }

        return post;
    }
};

export default resolvers;