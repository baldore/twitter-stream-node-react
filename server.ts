import * as http from 'http'
import * as next from 'next'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as mongoose from 'mongoose'
import * as socketIO from 'socket.io'
import { setupTweetsStreaming } from './utils/tweetsStream'

const app = next({ dev: true })
const handle = app.getRequestHandler()
const port = 3000

function setupMongoose() {
  mongoose.connect('mongodb://localhost/react-tweets')
}

function setupServer() {
  const app = express()
  const server = http.createServer(app)
  const io = socketIO.listen(server)

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))

  // Restful will be here somehow
  app.get('/foo', (req, res) => {
    res.send({
      foo: 'bar',
    })
  })

  app.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, (err: Error) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })

  return { io }
}

app.prepare().then(() => {
  setupMongoose()
  const { io } = setupServer()
  setupTweetsStreaming(io)
})
