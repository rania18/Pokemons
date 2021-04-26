// console.log('hello Rania')

const express = require('express')
const {success, getUniqueId} = require('./helper.js')
let pokemons = require('./mock-pokemon')
const morgan = require('morgan')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const {Sequelize} = require('sequelize')

const app = express()
const port = 5000

const sequelize = new Sequelize(
    'pokedex',
    'root',
    '',
    {
        host: 'localhost',
        dialect: 'mariadb',
        dialectOptions: {
            timezone: 'Etc/GMT-2'
        },
        logging: false
    }
)

sequelize.authenticate()
    .then(_ => console.log('la connexion a la base bien etablie'))
    .catch(error => console.error(`impossible  de se connecter a la base de donne ${error}`))

// const logger = (req, res, next)=>{
//     console.log(`URL : ${req.url}`)
//     next()
// }

// app.use((req, res, next)=>{
//     console.log(`URL : ${req.url}`)
//     next()
// })

app
    .use(favicon(__dirname +'/favicon.ico'))
    .use(morgan('dev'))
    .use(bodyParser.json())
    

app.get('/', (req,res)=> res.send('hello Rania hamdi'))

app.get('/api/pokemons/:id', (req,res)=>{
    const id = parseInt(req.params.id)
    const pokemon = pokemons.find(pokemon => pokemon.id === id)
    // res.send(`vous avez demandé le pokémon n ${pokemon.name}`)
    // res.json(pokemon)
    const message = ' un pokemon a bien été trouver'
    res.json(success(message, pokemon))
})

app.get('/api/pokemons', (req,res)=>{
    // res.send(`il ya ${pokemons.length} pokemons dans le pokédex `)
    const message = 'La liste de pokemon'
    res.json(success(message, pokemons))
})

//add pokemon
app.post('/api/pokemons', (req, res) => {
    const id =getUniqueId(pokemons)
    const pokemonCreated = {...req.body, ...{id:id, created: new Date()}}
    pokemons.push(pokemonCreated)
    const message = `Le pokemon ${pokemonCreated.name} a bien ete crée.`
    res.json(success(message, pokemonCreated))
})
//update
app.put('/api/pokemons/:id', (req, res) =>{
    const id = parseInt(req.params.id)
    const pokemonUpdate = {...req.body, id: id}
    pokemons = pokemons.map(pokemon =>{
        return pokemon.id === id ? pokemonUpdate: pokemon
    })
    const message = `Le pokemon ${pokemonUpdate.name} a bien modifier`
    res.json(success(message, pokemonUpdate))

})
//delete
app.delete('/api/pokemons/:id',(req, res)=>{
    const id = parseInt(req.params.id)
    const pokemonDeleted = pokemons.find(pokemon => pokemon.id === id)
    pokemons.filter(pokemon => pokemon.id !==id)
    const message = `Le pokemon ${pokemonDeleted.name} a bien supprimer`
    res.json(success(message, pokemonDeleted))

})
app.listen(port, ()=> console.log(`notre application sur : http://localhost:${port}`))