const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");
const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user");
const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

const resolvers = {
  Query: {
    bookCount: async () => await Book.collection.countDocuments(),
    authorCount: async () => await Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (args.genre) {
        return await Book.find({ genres: args.genre });
      } else {
        return await Book.find({});
      }
    },
    allAuthors: async () => {
      const authors = await Author.find({});
      authors.map((author) => {
        author.bookCount = author.books.length;
      });
      return authors;
    },
    me: (root, args, context) => context.currentUser,
  },
  Book: {
    author: async (root) => await Author.findById(root.author),
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("Invalid token", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      let author = await Author.findOne({ name: args.author });

      if (!author) {
        try {
          author = await Author.create({ name: args.author });
        } catch (error) {
          throw new GraphQLError(
            "Author name has to be atleast 4 characters long",
            {
              extensions: {
                code: "BAD_USER_INPUT",
              },
            }
          );
        }
      }

      try {
        let book = await Book.create({
          title: args.title,
          author: author._id,
          published: args.published,
          genres: args.genres,
        });

        pubsub.publish("BOOK_ADDED", { bookAdded: book });

        author.books.push(book._id);
        await author.save();

        return book;
      } catch (error) {
        if (error.errors.title.properties.type === "unique") {
          throw new GraphQLError("Book title must be unique", {
            extensions: {
              code: "BAD_USER_INPUT",
            },
          });
        } else {
          throw new GraphQLError(
            "Book title has to be atleast 5 characters long",
            {
              extensions: {
                code: "BAD_USER_INPUT",
              },
            }
          );
        }
      }
    },
    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("Invalid token", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      const author = await Author.findOne({ name: args.name });
      if (!author) {
        return null;
      }

      return await Author.findOneAndUpdate(
        { name: args.name },
        { born: args.setBornTo }
      );
    },
    createUser: async (root, args) => {
      try {
        const user = await User.create({
          username: args.username,
          favoriteGenre: args.favoriteGenre,
        });

        return user;
      } catch (error) {
        throw new GraphQLError("Username has to be atleast 3 characters long", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new GraphQLError("Invalid credentials", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
  },
  Subscription: {
    bookAdded: { subscribe: () => pubsub.asyncIterator("BOOK_ADDED") },
  },
};

module.exports = resolvers;
