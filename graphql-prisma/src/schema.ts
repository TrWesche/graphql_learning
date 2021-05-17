import {
    intArg,
    makeSchema,
    nonNull,
    objectType,
    stringArg,
    inputObjectType,
    arg,
    asNexusMethod,
    enumType,
  } from 'nexus'
  import { DateTimeResolver } from 'graphql-scalars'
  import { Context } from './context'
  
  export const DateTime = asNexusMethod(DateTimeResolver, 'date')
  
  const Query = objectType({
    name: 'Query',
    definition(t) {
      t.nullable.field('userById', {
        type: 'User',
        args: {
          id: stringArg(),
        },
        resolve: (_parent, args, context: Context) => {
          return context.prisma.user.findUnique({
            where: { id: args.id || undefined },
          })
        }
      })

      t.nonNull.list.nonNull.field('allUsers', {
        type: 'User',
        resolve: (_parent, _args, context: Context) => {
          return context.prisma.user.findMany()
        },
      })

      t.nullable.field('postById', {
        type: 'Post',
        args: {
          id: stringArg(),
        },
        resolve: (_parent, args, context: Context) => {
          return context.prisma.post.findUnique({
            where: { id: args.id || undefined },
          })
        },
      })
  
      t.nonNull.list.nonNull.field('allPosts', {
        type: 'Post',
        args: {
          searchString: stringArg(),
          skip: intArg(),
          take: intArg(),
          orderBy: arg({
            type: 'PostOrderByUpdatedAtInput',
          }),
        },
        resolve: (_parent, args, context: Context) => {
          const or = args.searchString
            ? {
              OR: [
                { title: { contains: args.searchString } },
                { body: { contains: args.searchString } },
              ],
            }
            : {}
  
          return context.prisma.post.findMany({
            where: {
              published: true,
              ...or,
            },
            take: args.take || undefined,
            skip: args.skip || undefined,
            orderBy: args.orderBy || undefined,
          })
        },
      })
  
      t.list.field('userNotPublished', {
        type: 'Post',
        args: {
          userUniqueInput: nonNull(
            arg({
              type: 'UserUniqueInput',
            }),
          ),
        },
        resolve: (_parent, args, context: Context) => {
          return context.prisma.user
            .findUnique({
              where: {
                id: args.userUniqueInput.id || undefined,
                email: args.userUniqueInput.email || undefined,
              },
            })
            .posts({
              where: {
                published: false,
              },
            })
        },
      })

      t.list.field('userPublished', {
        type: 'Post',
        args: {
          userUniqueInput: nonNull(
            arg({
              type: 'UserUniqueInput',
            }),
          ),
        },
        resolve: (_parent, args, context: Context) => {
          return context.prisma.user
            .findUnique({
              where: {
                id: args.userUniqueInput.id || undefined,
                email: args.userUniqueInput.email || undefined,
              },
            })
            .posts({
              where: {
                published: true,
              },
            })
        },
      })

      t.nullable.field('commentById', {
        type: 'Comment',
        args: {
          id: stringArg(),
        },
        resolve: (_parent, args, context: Context) => {
          return context.prisma.comment.findUnique({
            where: { id: args.id || undefined },
          })
        }
      })

      t.list.field('postComments', {
        type: 'Comment',
        args: {
          postUniqueInput: nonNull(
            arg({
              type: 'PostUniqueInput',
            }),
          ),
        },
        resolve: (_parent, args, context: Context) => {
          return context.prisma.post
            .findUnique({
              where: {
                id: args.postUniqueInput.id
              },
            })
            .comments()
        },
      })
    },
  })
  
  const Mutation = objectType({
    name: 'Mutation',
    definition(t) {
      t.nonNull.field('createUser', {
        type: 'User',
        args: {
          data: nonNull(
            arg({
              type: 'UserCreateInput',
            }),
          ),
        },
        resolve: (_, args, context: Context) => {
          const postData = args.data.posts?.map((post) => {
            return { title: post.title, content: post.content || undefined }
          })
          return context.prisma.user.create({
            data: {
              name: args.data.name,
              email: args.data.email,
              age: args.data.age,
              posts: {
                create: postData,
              },
            },
          })
        },
      })
  
      t.field('createPost', {
        type: 'Post',
        args: {
          data: nonNull(
            arg({
              type: 'PostCreateInput',
            }),
          ),
          authorId: nonNull(stringArg()),
        },
        resolve: (_, args, context: Context) => {
          return context.prisma.post.create({
            data: {
              title: args.data.title,
              body: args.data.body,
              author: {
                connect: { id: args.authorId },
              },
            },
          })
        },
      })
  
      t.field('togglePublishPost', {
        type: 'Post',
        args: {
          id: nonNull(stringArg()),
        },
        resolve: async (_, args, context: Context) => {
          try {
            const post = await context.prisma.post.findUnique({
              where: { id: args.id || undefined },
              select: {
                published: true,
              },
            })
            return context.prisma.post.update({
              where: { id: args.id || undefined },
              data: { published: !post?.published },
            })
          } catch (e) {
            throw new Error(
              `Post with ID ${args.id} does not exist in the database.`,
            )
          }
        },
      })
  
      t.field('incrementPostViewCount', {
        type: 'Post',
        args: {
          id: nonNull(stringArg()),
        },
        resolve: (_, args, context: Context) => {
          return context.prisma.post.update({
            where: { id: args.id || undefined },
            data: {
              viewCount: {
                increment: 1,
              },
            },
          })
        },
      })
  
      t.field('deletePost', {
        type: 'Post',
        args: {
          id: nonNull(stringArg()),
        },
        resolve: (_, args, context: Context) => {
          return context.prisma.post.delete({
            where: { id: args.id },
          })
        },
      })

      t.field('createComment', {
        type: 'Comment',
        args: {
          data: nonNull(
            arg({
              type: 'CommentCreateInput',
            }),
          ),
          authorId: nonNull(stringArg()),
          postId: nonNull(stringArg()),
        },
        resolve: (_, args, context: Context) => {
          return context.prisma.comment.create({
            data: {
              text: args.data.text,
              author: {
                connect: { id: args.authorId },
              },
              post: {
                connect: { id: args.postId },
              }
            },
          })
        },
      })
    },
  })
  
  const User = objectType({
    name: 'User',
    definition(t) {
      t.nonNull.string('id')
      t.string('name')
      t.nonNull.string('email')
      t.int('age')
      t.nonNull.list.nonNull.field('posts', {
        type: 'Post',
        resolve: (parent, _, context: Context) => {
          return context.prisma.user
            .findUnique({
              where: { id: parent.id || undefined },
            })
            .posts()
        },
      })
    },
  })
  
  const Post = objectType({
    name: 'Post',
    definition(t) {
      t.nonNull.int('id')
      t.nonNull.field('createdAt', { type: 'DateTime' })
      t.nonNull.field('updatedAt', { type: 'DateTime' })
      t.nonNull.string('title')
      t.string('body')
      t.nonNull.boolean('published')
      t.nonNull.int('viewCount')
      t.field('author', {
        type: 'User',
        resolve: (parent, _, context: Context) => {
          return context.prisma.post
            .findUnique({
              where: { id: parent.id || undefined },
            })
            .author()
        },
      })
      t.nonNull.list.nonNull.field('comments', {
        type: 'Comment',
        resolve: (parent, _, context: Context) => {
          return context.prisma.post
            .findUnique({
              where: { id: parent.id || undefined }
            })
            .comments()
        }
      })
    },
  })
  
  const Comment = objectType({
    name: 'Comment',
    definition(t) {
      t.nonNull.string('id')
      t.string('text')
      t.nonNull.field('author', {
        type: 'User',
        resolve: (parent, _, context: Context) => {
          return context.prisma.comment
            .findUnique({
              where: { id: parent.id || undefined },
            })
            .author()
        },
      })
      t.nonNull.field('post', {
        type: 'Post',
        resolve: (parent, _, context: Context) => {
          return context.prisma.comment
            .findUnique({
              where: { id: parent.id || undefined },
            })
            .post()
        },
      })
    },
  })

  const SortOrder = enumType({
    name: 'SortOrder',
    members: ['asc', 'desc'],
  })
  
  const PostOrderByUpdatedAtInput = inputObjectType({
    name: 'PostOrderByUpdatedAtInput',
    definition(t) {
      t.nonNull.field('updatedAt', { type: 'SortOrder' })
    },
  })
  
  const PostUniqueInput = inputObjectType({
    name: 'PostUniqueInput',
    definition(t) {
      t.string('id')
    }
  })

  const UserUniqueInput = inputObjectType({
    name: 'UserUniqueInput',
    definition(t) {
      t.string('id')
      t.string('email')
    },
  })

  const PostCreateInput = inputObjectType({
    name: 'PostCreateInput',
    definition(t) {
      t.nonNull.string('title')
      t.string('body')
      t.boolean('published')
    },
  })
  
  const UserCreateInput = inputObjectType({
    name: 'UserCreateInput',
    definition(t) {
      t.nonNull.string('email')
      t.string('name')
      t.int('age')
      t.list.nonNull.field('posts', { type: 'PostCreateInput' })
    },
  })

  const CommentCreateInput = inputObjectType({
    name: 'CommentCreateInput',
    definition(t) {
      t.nonNull.string('text')
    }
  })
  
  export const schema = makeSchema({
    types: [
      Query,
      Mutation,
      Post,
      User,
      Comment,
      UserUniqueInput,
      UserCreateInput,
      PostUniqueInput,
      PostCreateInput,
      CommentCreateInput,
      SortOrder,
      PostOrderByUpdatedAtInput,
      DateTime,
    ],
    outputs: {
      schema: __dirname + '/../schema.graphql',
      typegen: __dirname + '/generated/nexus.ts',
    },
    contextType: {
      module: require.resolve('./context'),
      export: 'Context',
    },
    sourceTypes: {
      modules: [
        {
          module: '@prisma/client',
          alias: 'prisma',
        },
      ],
    },
  })