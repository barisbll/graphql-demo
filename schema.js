import { gql } from "apollo-server-express";

export const typeDefs = gql`#graphql
    type Game {
        id: ID!, # ! means required (not allowed to be null)
        title: String!,
        platform: [String!]! # array of strings (array and strings can't be nullable)
        reviews: [Review!]
    }
    type Review {
        id: ID!,
        rating: Int!,
        content: String!
        game: Game!,
        author: Author!
    }
    type Author {
        id: ID!,
        name: String!,
        verified: Boolean!
        reviews: [Review!]
    }
    type Query {
        reviews: [Review],
        review(id: ID!): Review,
        games: [Game],
        game(id: ID!): Game,
        authors: [Author]
        author(id: ID!): Author
    }
    type Mutation {
        addGame(game: AddGameInput!): Game,
        deleteGame(id: ID!): [Game],
        updateGame(id: ID!, game: EditGameInput!): Game
    }
    input AddGameInput {
        title: String!,
        platform: [String!]!
    }
    input EditGameInput {
        title: String,
        platform: [String!]
    }

`

// there are 5 scalar types in GraphQL
// String, Int, Float, Boolean, ID