// import { createServer } from 'http'
// import next from 'next'
// import io from './wsManger.ts'

// const PORT = parseInt(process.env.PORT || '3000', 10)
// const isDevEnv = process.env.NODE_ENV !== 'production'
// const nextApp = next({ dev: isDevEnv, turbo: true })
// const nextReqHandler = nextApp.getRequestHandler()

// nextApp.prepare().then(() => {
//   const server = createServer( (req, res) => {
//     return nextReqHandler(req, res)
//   })

//   io.attach(server)

//   server.listen(PORT, () => {
//     console.log(`Servidor escuchando en http://localhost:${PORT}`)
//   })
// })
import express from 'express'

const app = express()
const PORT = process.env.PORT || 3001

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`)
})
  