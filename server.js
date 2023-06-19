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
    })
})

const RootQueryType = new GraphQLObjectType({
    name : 'Query',
    description: 'Root Query',
    fields: () => ({
        movies: {
            type: new GraphQLList(MovieType),
            description: 'List of Movies',
            resolve: () => movies
        }
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType
})

app.use('/graphql', expressGraphQL.graphqlHTTP({
    schema: schema,
    graphiql: true
}))
app.listen(5000, () => console.log('Server Running'))