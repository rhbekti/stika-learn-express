const dotenv = require('dotenv')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const router = require('./routes')
const pino = require('pino')
const pinoHttp = require('pino-http')
const rateLimit = require('express-rate-limit')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')

dotenv.config()

const app = express()
const port = process.env.PORT

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
})

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false
})

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
  })
)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(pinoHttp({ logger }))
app.use(limiter)

app.get('/', (req, res) => {
  res.send('Server Works!')
})

app.use('/api', router)
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocument))

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server started on port ${port}`)
  })
}

module.exports = app
