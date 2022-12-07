const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send("Hello World")
  // return housing data here
})

app.listen(8080, () => {
  console.log('Server is listening on port 8080....')
})
