const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const jwt = require('express-jwt')
const jwksRsa = require('jwks-rsa')
const shortid = require('shortid')


// import configuration from env file
require('dotenv').config()

// define the Express app
const app = express();

// the temporal database
const notes = []

// enhance your app security with Helmet
app.use(helmet())

// use bodyParser to parse application/json content-type
app.use(bodyParser.json())

// enable all CORS requests
app.use(cors())

// log HTTP requests
app.use(morgan('combined'))

// adding authentication middleware
const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: process.env.AUTH0_DOMAIN + '/.well-known/jwks.json'
    }),

    // Validate the audience and the issuer.
    audience: process.env.AUTH0_CLIENT_ID,
    issuer: process.env.AUTH0_DOMAIN + '/',
    algorithms: ['RS256']
})

// say hello world
app.get('/', (req, res) => {
    res.send('hello world')
})

// insert a new note
app.post('/', (req, res) => {
    const {title, date, content, author, public} = req.body
    const new_note = {
        id: shortid.generate(),
        title,
        date,
        content,
        author,
        public
    }
    console.log("new note:", new_note)
    notes.push(new_note)
    res.status(200).send({ 'id': new_note['id'] })
})

// get a specific note
app.get('/note/:id', checkJwt, (req, res) => {
    let author = req.user === undefined ? null : req.user.nickname
    console.log("filter", author)
    const note = notes.filter(n => (n.id === req.params.id && n.author === author))
    if (note.length > 1) return res.status(500).send();
    if (note.length === 0) return res.status(404).send();
    res.send(note[0])
})

// get a all notes for author
app.get('/author', checkJwt, (req, res) => {
    let author = req.user === undefined ? null : req.user.nickname
    console.log("list", author)
    const note = notes.filter(n => (n.author === author))
    res.send(note)
})

// start the server
app.listen(8081, () => { console.log('listening on port 8081') })