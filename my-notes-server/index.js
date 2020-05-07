const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const jwt = require('express-jwt')
const jwksRsa = require('jwks-rsa')
const shortid = require('shortid')
const Promise = require('bluebird')
const winston = require('winston')

const DAO = require('./dao')
const Notes = require('./notes')

// import configuration from env file
require('dotenv').config()

// create logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        //new winston.transports.File({ filename: 'snotes.error.log', level: 'error' }),
        new winston.transports.File({ filename: 'snotes.all.log' })
    ]
})

logger.error = err => {
	if (err instanceof Error) {
		logger.log({ level: 'error', message: `${err.stack || err}` })
	} else {
		logger.log({ level: 'error', message: err })
	}
}

logger.debug("LOGGER WAS CREATED")


// open database connection
const dao = new DAO('./database.sqlite3')
logger.info("Connection to database was stablished")
const notesRepo = new Notes(dao)
notesRepo.createTable()
    .catch((err) => {
        //console.log('Error: ')
        //console.log(JSON.stringify(err))
		logger.error("ERROR while creating database")
		logger.error(JSON.stringify(err))
    })
logger.info("NOTES table was created (if necessary)")

// define the Express app
const app = express()
const port = process.env.PORT || 5000
logger.info(`Web server port was set to ${port}`)


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
app.post('/', checkJwt, (req, res) => {
//app.post('/', (req, res) => {
    const note = req.body
    if(note.shortId === '') {
        note.shortId = shortid.generate()
        notesRepo.create(note)
            .then( (rst) => {
                res.status(200).send({ 'shortId': note['shortId'] })
            })
            .catch( (err) => {
                console.log('ERROR - / (new)')
                console.log(err)
                res.sendStatus(500)
            })
    } else {
        notesRepo.update(note)
            .then( (rst) => {
                res.status(200).send({ 'shortId': note['shortId'] })
            })
            .catch( (err) => {
                console.log('ERROR - / (update)')
                console.log(err)
                res.sendStatus(500)
            })
    }
})

// get a specific note from an author
app.get('/note/:id', checkJwt, (req, res) => {
//app.get('/note/:id', (req, res) => {
    let nickname = req.user === undefined ? null : req.user.nickname
    notesRepo.getByIdAndAuthor(req.params.id, nickname)
        .then( (rst) => {
            res.send(rst)
        })
        .catch( (err) => {
            console.log('ERROR - /note/:id')
            console.log(err)
            res.sendStatus(500)
        })
})

// get a public note
app.get('/public/:id', (req, res) => {
    notesRepo.getByIdPublic(req.params.id, true)
        .then( (rst) => {
            if( rst === undefined || !rst.isPublic ) {
                res.send([])
            } else {
				if(!rst.showCreation) {
					delete rst.creationDate
				}
				if(!rst.showUpdate) {
					delete rst.updateDate
				}
				if(!rst.showAuthor) {
					delete rst.author
				}
				delete rst.nickname
                res.send(rst)
            }
        })
        .catch( (err) => {
            console.log('ERROR - /note/:id')
            console.log(err)
            res.sendStatus(500)
        })
})

// get all notes for author
app.get('/author', checkJwt, (req, res) => {
//app.get('/author', (req, res) => {
	logger.info("Access using '/author'")
	var nickname = ''
	try {
		logger.debug("Getting nickname from 'res.user'")
		nickname = req.user === undefined ? null : req.user.nickname
		logger.debug(`Gotten nickname from res.user (${nickname})`)
	} catch(err) {
		logger.error("ERROR getting nickname from res.user")
		logger.error(JSON.stringify(err))
	}
    notesRepo.getByAuthor(nickname)
        .then( (rst) => {
			rst = rst.map( (x) => {
				delete x.content
				delete x.showCreation
				delete x.showUpdate
				delete x.showAuthor
				return(x)
			} )
			logger.info("Sent result from 'notesRepo.getByAuthor'")
            res.send(rst)
        })
        .catch( (err) => {
            //console.log('ERROR - /author')
            //console.log(err)
			logger.error("ERROR while processing result from 'notesRepo.getByAuthor'")
			logger.error(JSON.stringify(err))
			logger.error(err)
            res.sendStatus(500)
        } )
})

// delete a specific note
app.delete('/delete/:id', checkJwt, (req, res) => {
//app.delete('/delete/:id', (req, res) => {
    let nickname = req.user === undefined ? null : req.user.nickname
    notesRepo.delete(req.params.id, nickname)
        .then( (rst) => {
            res.status(200).send(rst)
        })
        .catch( (err) => {
            console.log('ERROR - /delete/:id')
            console.log(err)
            res.sendStatus(500)
        } )
})

// start the server
app.listen(port, () => { 
	logger.info(`Web application listening on port ${port}`)
	console.log(`listening on port ${port}`) 
})