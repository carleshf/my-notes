const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const jwt = require('express-jwt')
const jwksRsa = require('jwks-rsa')

// import configuration from env file
require('dotenv').config()

// define the Express app
const app = express();

// the temporal database
const notes = [];

// enhance your app security with Helmet
app.use(helmet());

// use bodyParser to parse application/json content-type
app.use(bodyParser.json());

// enable all CORS requests
app.use(cors());

// log HTTP requests
app.use(morgan('combined'));

// adding authentication middleware
const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://process.env.AUTH0_DOMAIN/.well-known/jwks.json`
    }),

    // Validate the audience and the issuer.
    audience: 'process.env.AUTH0_CLIENT_ID',
    issuer: `process.env.AUTH0_DOMAIN`,
    algorithms: ['RS256']
});

// retrieve all questions
app.get('/', (req, res) => {
    res.send('hello world');
});

// start the server
app.listen(8081, () => { console.log('listening on port 8081'); });