const express = require('express')
const path = require('path')

const app = express()

// setup static and middleware
app.use(express.static('public'))

app.get('/', (req, res) => {})

app.get('/test', (req, res) => {
  res.status(200).json({ message: "It works!!" })
})

app.listen(8080, () => {
  console.log('server is listening on port 8080....')
})





