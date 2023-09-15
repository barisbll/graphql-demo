import { ApolloServer } from "apollo-server-express";

import { typeDefs } from "./schema.js";
import db from "./_db.js";
import express from "express";
import http from "http";

const app = express();

const resolvers = {
    Query: {
        games: () => {
            return db.games;
        },
        game: (_, args) => {
            return db.games.find(game => game.id === args.id);
        },
        authors: () => {
            return db.authors;
        },
        author: (_, args) => {
            return db.authors.find(author => author.id === args.id);
        },
        reviews: () => {
            return db.reviews;
        },
        review: (_, args) => {
            return db.reviews.find(review => review.id === args.id);
        }
    },
    Game: {
        reviews: (parent) => { // parent is the game object
            return db.reviews.filter(review => review.game_id === parent.id);
        }
    },
    Author: {
        reviews: (parent) => {
            return db.reviews.filter(review => review.author_id === parent.id);
        }
    },
    Review: {
        game: (parent) => {
            return db.games.find(game => game.id === parent.game_id);
        },
        author: (parent) => {
            return db.authors.find(author => author.id === parent.author_id);
        }
    },
    Mutation: {
        deleteGame: (_, args) => {
            db.games = db.games.filter(game => game.id !== args.id);
            return db.games;
        },
        addGame: (_, args) => {
            const newGame = {
                id: String(db.games.length + 1),
                title: args.game.title,
                platform: args.game.platform
            }
            db.games.push(newGame);
            return newGame;
        },
        updateGame: (_, args) => {
            const game = db.games.find(game => game.id === args.id);
            if (args.game.title) {
                game.title = args.game.title;
            }
            if (args.game.platform) {
                game.platform = args.game.platform;
            }
            return game;
        }

    }
}

let apolloServer = null;
async function startServer() {
    apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });
}
startServer();

app.get("/rest", function (req, res) {
    res.json({ data: "api working" });
});
const httpserver = http.createServer(app);

app.listen(4000, function () {
    console.log(`server running on port 4000`);
    console.log(`gql path is ${apolloServer.graphqlPath}`);
});