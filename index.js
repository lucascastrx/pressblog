const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send('Hellow world')
})

app.listen(8080, () => {
  console.log('Server de pé!')
})
