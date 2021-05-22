const resolvers = {
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
    }
};

export default resolvers;