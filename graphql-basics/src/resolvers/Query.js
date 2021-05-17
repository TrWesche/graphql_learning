const Query = {
    users(parent, args, { db }, info) {
        if (!args.query) {
            return db.users;
        }

        return db.users.filter((user) => {
            return user.name.toLowerCase().includes(args.query.toLowerCase());
        })
    },
    posts(parent, args, { db }, info) {
        if (!args.query && !args.hasOwnProperty("publish_status")) {
            return db.posts;
        }

        let processingArray = db.posts;
        if (args.hasOwnProperty("publish_status")) {
            processingArray = processingArray.filter((post) => {
                return post.published === args.publish_status;
            })
        }

        if (args.query) {
            processingArray = processingArray.filter((post) => {
                let titleSearchResult = post.title.toLowerCase().includes(args.query.toLowerCase());

                if (titleSearchResult) {
                    return titleSearchResult;
                }

                return post.body.toLowerCase().includes(args.query.toLowerCase());
            })
        }

        return processingArray;

    },
    comments(parent, args, { db }, info) {
        return db.comments;
        // if (!args.query) {
        //     return comments;
        // }

        // return users.filter((user) => {
        //     return user.name.toLowerCase().includes(args.query.toLowerCase());
        // })
    },
    me() {
        return {
            id: '12345',
            name: 'Mike',
            email: 'mike@fakeprovider.com',
            // age: 45 // This will result in null being returned for age
        }
    },
    post() {
        return {
            id: 'ABCPOSTID',
            title: 'My First Post',
            body: 'GraphQL is pretty cool',
            published: true
        }
    }
}

export default Query;