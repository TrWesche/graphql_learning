import { v4 as uuidV4 } from "uuid";

const Mutation = {
    createUser(parent, args, { db }, info) {
        const emailTaken = db.users.some((user) => {
            return user.email.toLowerCase() === args.data.email.toLowerCase();
        })

        if (emailTaken) {
            throw new Error(`An account has already been registered under that email.`)
        }

        // The "..." syntax shown below comes from the babel-plugin-transform-object-rest-spread
        const user = {
            id: uuidV4(),
            ...args.data
        }

        db.users.push(user);

        return user;
    },
    deleteUser(parent, args, { db }, info) {
        const userIndex = db.users.findIndex((user) => {
            return user.id === args.user_id;
        })

        if (userIndex === -1) {
            throw new Error(`User not found`);
        }

        const deletedUsers = db.users.splice(userIndex, 1);

        db.posts = db.posts.filter((post) => {
            const match = post.author_id === args.user_id;

            if (match) {
                db.comments = db.comments.filter((comment) => {
                    return comment.post_id !== post.id;
                })
            }

            return !match
        })

        db.comments = db.comments.filter((comment) => {
            return comment.author_id !== args.user_id;
        })

        return deletedUsers[0];
    },
    updateUser(parent, args, { db }, info) {
        const {user_id, data} = args

        const user = db.users.find((user) => user.id === user_id);

        if (!user) {
            throw new Error(`User not found`);
        }

        if (typeof data.email === 'string') {
            const emailTaken = db.users.some((user) => {
                return user.email.toLowerCase() === data.email.toLowerCase();
            })
    
            if (emailTaken) {
                throw new Error(`An account has already been registered under that email.`)
            }

            user.email = data.email
        }

        if (typeof data.name === 'string') {
            user.name = data.name
        }

        if (typeof data.age !== 'undefined') {
            user.age = data.age
        }

        return user
    },
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
    },
    createComment(parent, args, { db, pubsub }, info) {
        const userExists = db.users.some((user) => {
            return user.id === args.data.author_id;
        })

        if (!userExists) {
            throw new Error(`User not found.`)
        }

        const postValid = db.posts.some((post) => {
            return post.id === args.data.post_id && post.published;
        })

        if (!postValid) {
            throw new Error(`Could not find target post.`)
        }

        const comment = {
            id: uuidV4(),
            ...args.data
        }

        db.comments.push(comment);
        pubsub.publish(`comment:${args.data.post_id}`, { 
            comment: {
                mutation: "CREATED",
                data: comment
            }
        })

        return comment;
    },
    updateComment(parent, args, { db, pubsub }, info) {
        const {comment_id, data} = args;

        const comment = db.comments.find(comment => comment.id === comment_id);

        if (!comment) {
            throw new Error(`Comment not found`)
        }

        if (typeof data.text === 'string') {
            comment.text = data.text;
        }

        pubsub.publish(`comment:${comment.post_id}`, { 
            comment: {
                mutation: "UPDATED",
                data: comment
            }
        })

        return comment;
    },
    deleteComment(parent, args, { db, pubsub }, info) {
        const commentIndex = db.comments.findIndex(comment => comment.id === args.comment_id);

        if (commentIndex === -1) {
            throw new Error(`Comment not found`);
        }

        const [comment] = db.comments.splice(commentIndex, 1);

        pubsub.publish(`comment:${comment.post_id}`, { 
            comment: {
                mutation: "DELETED",
                data: comment
            }
        })

        return comment;
    }
}

export default Mutation;