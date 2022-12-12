const express = require('express')
const path = require('path')
const app = express()
const port = 3000

app.set('view engine', 'hbs')
app.use(express.static(path.join(__dirname, '../public'))) //Se accede poniendo el nombre del fichero en html

app.get('', (req, res) => res.send('<h1>Hello World!</h1>'))
app.get('/help', (req, res) => res.send('Hello help!'))
app.get('/dynamic', (req, res) => res.render('index', {title: 'Hi, im a variable'}))

const pokemons = ['Pikachu', 'Squirtle', 'Charmander']
app.get('/params', (req, res) => {
    console.log(req.query);
    if(!req.query.pokemon) return res.send('Pokemon not found')
    let ret = pokemons.find(x => x == req.query.pokemon);
    return res.send(ret)
})
app.get('*', (req, res) =>res.send('My 404 page') )
app.listen(port, () => console.log(`Example app listening on port ${port}!`))