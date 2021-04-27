const express = require('express')
const morgan = require('morgan')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const sequelize = require('./src/db/sequelize')

const app = express()
const port = 5000

app
    .use(favicon(__dirname +'/favicon.ico'))
    .use(morgan('dev'))
    .use(bodyParser.json())
    
sequelize.initDb()

require('./src/routes/findAllPokemons')(app)
require('./src/routes/findPokemonByPk')(app)
require('./src/routes/createPokemon')(app)
require('./src/routes/updatePokemon')(app)
require('./src/routes/deletePokemon')(app)

app.listen(port, ()=> console.log(`notre application sur : http://localhost:${port}`))