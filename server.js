const express = require('express')
const path = require('path')
const NounProject = require('the-noun-project')

const app = express()
const np = new NounProject({
  key: process.env.NOUN_PROJ_APIKEY,
  secret: process.env.NOUN_PROJ_SECRET
})

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'))
})

app.get('/icon', (req, res) => {
  const maxTries = 3
  const handler = (numTry) => {
    if (numTry < maxTries) {
      const randomId = Math.floor(Math.random() * 1538985)
      np.getIconById(randomId, (err, data) => {
        if (err) {
          handler(numTry++)
        } else {
          res.json(data)
        }
      })
    } else {
      res.status(500)
    }
  }

  handler(0)
})

const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`)
})
