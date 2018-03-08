import * as next from 'next'
import * as express from 'express'
import * as bodyParser from 'body-parser'

const app = next({ dev: true })
const handle = app.getRequestHandler()
const port = 3000

app.prepare().then(() => {
  const server = express()

  server.use(bodyParser.json())
  server.use(bodyParser.urlencoded({ extended: false }))

  server.get('/foo', (req, res) => {
    res.send({
      foo: 'bar',
    })
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, (err: Error) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
