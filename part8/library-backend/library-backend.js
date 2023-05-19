const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user");
const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;

console.log("connecting to", MONGODB_URI);

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("connected to MongoDB"))
  .catch((error) => console.log("error connection to MongoDB", error.message));

const typeDefs = `
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Author {
    name: String!,
    born: Int,
    bookCount: Int!
    id: ID!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book!
    editAuthor(name: String!, setBornTo: Int!): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`;

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
    allAuthors: async () => await Author.find({}),
    me: (root, args, context) => context.currentUser,
  },
  Author: {
    bookCount: async (root) => {
      return await Book.find({ author: root.id }).countDocuments();
    },
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
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.startsWith("Bearer ")) {
      const decodedToken = jwt.verify(
        auth.substring(7),
        process.env.JWT_SECRET
      );
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
