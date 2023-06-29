const express = require('express')
const expressGraphQL = require('express-graphql')
const{
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt
} = require('graphql')
const app = express()

const directors = [
{id: 1, name: 'Christopher Nolan'},
{id: 2, name: 'Zack Snyder'},
{id: 3, name: 'Russo Brothers'}
]

const movies = [
    {id: 1, name: 'ABC121', directorId: 1},
    {id: 2, name: 'ABC122', directorId: 1},
    {id: 3, name: 'ABC123', directorId: 1},
    {id: 4, name: 'ABC124', directorId: 2},
    {id: 5, name: 'ABC125', directorId: 2},
    {id: 6, name: 'ABC126', directorId: 2},
    {id: 7, name: 'ABC127', directorId: 3},
    {id: 8, name: 'ABC128', directorId: 3},
    {id: 9, name: 'ABC129', directorId: 3}
]

const MovieType = new GraphQLObjectType({
    name: 'Movie',
    description: 'This represents a movie made by a director',
    fields: () => ({
        id : {type : GraphQLNonNull(GraphQLInt)},
        name : {type: GraphQLNonNull(GraphQLString)},
        directorId : {type: GraphQLNonNull(GraphQLInt)},
        director: {
            type: DirectorType,
            resolve : (movie) => {
                return directors.find(director => director.id === movie.directorId)
            }
        }
    })
})

const DirectorType = new GraphQLObjectType({
    name: 'Director',
    description: 'This represents a director of a movie',
    fields: () => ({
        id : {type : GraphQLNonNull(GraphQLInt)},
        name : {type: GraphQLNonNull(GraphQLString)},
        movies: {
            type: GraphQLList(MovieType),
            resolve : (director) => {
                return movies.filter(movie => movie.directorId === director.id)
            }
        }
    })
})

const RootQueryType = new GraphQLObjectType({
    name : 'Query',
    description: 'Root Query',
    fields: () => ({
        movie: {
            type: MovieType,
            description: 'A Movie',
            args: {
                id: {type: GraphQLInt}
            },
            resolve: (parent, args) => movies.find(movie => movie.id === args.id)
        },
        movies: {
            type: new GraphQLList(MovieType),
            description: 'List of Movies',
            resolve: () => movies
        },
        director: {
            type: DirectorType,
            description: 'A Director',
            args: {
                id: {type: GraphQLInt}
            },
            resolve: (parent, args) => directors.find(director => director.id === args.id)
        },
        directors: {
            type: new GraphQLList(DirectorType),
            description: 'List of Directors',
            resolve: () => directors
        }
    })
})

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addMovie : {
            type: MovieType,
            description: 'Add a Movie',
            args: {
                name: {type:GraphQLNonNull(GraphQLString)},
                directorId: {type: GraphQLNonNull(GraphQLInt)}
            },
            resolve: (parent, args) => {
                const movie = {id: movies.length+1, name: args.name, directorId: args.directorId}
                movies.push(movie)
                return movie
            }
        },
        addDirector: {
            type: DirectorType,
            description: 'Add a Director',
            args: {
                name: { type: GraphQLNonNull(GraphQLString)}
            },
            resolve: (parent, args) => {
                const director = {id: directors.length+1, name: args.name}
                directors.push(director)
                return director
            }
        }
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})

app.use('/graphql', expressGraphQL.graphqlHTTP({
    schema: schema,
    graphiql: true
}))
app.listen(5000, () => console.log('Server Running'))