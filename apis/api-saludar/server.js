const express = require('express')
const routes = require('./src/routes')
const http = require('http')

const PUERTO = 4001

const app = express()

app.use(express.json())
app.use(routes)

const server = http.createServer(app)

server.listen(PUERTO, () => {
  console.log(`Escuchando en http://localhost:${PUERTO}...`)
})
