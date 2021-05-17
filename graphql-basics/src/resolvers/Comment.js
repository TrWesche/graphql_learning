const Comment = {
    author(parent, args, { db }, info) {
        return db.users.find((user) => {
            return user.id === parent.author_id;
        })
    },
    post(parent, args, { db }, info) {
        return db.posts.find((post) => {
            return post.id === parent.post_id;
        })
    }
};

export default Comment;