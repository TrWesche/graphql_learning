import { v4 as uuidV4 } from "uuid";

const resolvers = {
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
    }
};

export default resolvers;