const http = require('http')
const port = 80

const winston = require('winston');

// create logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        //new winston.transports.File({ filename: 'snotes.error.log', level: 'error' }),
        new winston.transports.File({ filename: 'snotes.all.log' })
    ]
});

const server = http.createServer(function (req, res) {
    logger.info('Incoming')
    res.writeHead(200, {'Content-Type': 'text/html'}) // http header
    var url = req.url
    logger.info('Incoming - ', url)
    logger.info('Incoming - ', req)
    if(url ==='/about'){
        res.write('<h1>about us page<h1>'); //write a response
        res.end(); //end the response
    } else if(url ==='/contact') {
        res.write('<h1>contact us page<h1>'); //write a response
        res.end(); //end the response
    } else {
        res.write('<h1>Hello World!<h1>'); //write a response
        res.end(); //end the response
    }
})


server.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on ${port}`)
})