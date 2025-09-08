import { createServer } from 'http'
import io from './wsManger.js'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'

global.__dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()
const server = createServer(app)
const PORT = process.env.PORT || 3001

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/index.html')
})

app.get('/about', (req, res) => {
  res.sendFile(__dirname + '/client/about.html')
})

io.attach(server)

server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`)
})
