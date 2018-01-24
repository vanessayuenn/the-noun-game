const express = require('express')
const NounProject = require('the-noun-project')

const app = express()
const np = new NounProject({
  key: process.env.NOUN_PROJ_APIKEY,
  secret: process.env.NOUN_PROJ_SECRET
})

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

app.get('/icon', (req, res) => {
  res.json({
  "icon": {
    "attribution": "Shinto gateway by Lluisa Iborra from Noun Project",
    "attribution_preview_url": "https://d30y9cdsu7xlg0.cloudfront.net/attribution/1014145-600.png",
    "collections": [{
      "author": {
        "location": "Granollers, Barcelona, ES",
        "name": "Lluisa Iborra",
        "permalink": "/marialuisa.iborra",
        "username": "marialuisa.iborra"
      },
      "author_id": "2129742",
      "date_created": "2017-04-19 13:17:00",
      "date_updated": "2017-04-19 13:17:00",
      "description": "",
      "id": "32708",
      "is_collaborative": "",
      "is_featured": "0",
      "is_published": "1",
      "is_store_item": "0",
      "name": "Shinto gateway",
      "permalink": "/marialuisa.iborra/collection/shinto-gateway",
      "slug": "shinto-gateway",
      "sponsor": {},
      "sponsor_campaign_link": "",
      "sponsor_id": "",
      "tags": [],
      "template": "24"
    }],
    "date_uploaded": "2017-04-19",
    "id": "1014145",
    "is_active": "1",
    "is_explicit": "0",
    "license_description": "creative-commons-attribution",
    "nounji_free": "0",
    "permalink": "/term/shinto-gateway/1014145",
    "preview_url": "https://d30y9cdsu7xlg0.cloudfront.net/png/1014145-200.png",
    "preview_url_42": "https://d30y9cdsu7xlg0.cloudfront.net/png/1014145-42.png",
    "preview_url_84": "https://d30y9cdsu7xlg0.cloudfront.net/png/1014145-84.png",
    "sponsor": {},
    "sponsor_campaign_link": null,
    "sponsor_id": "",
    "tags": [{
      "id": 268271,
      "slug": "shinto-gateway"
    }, {
      "id": 1803,
      "slug": "entrance"
    }, {
      "id": 6224,
      "slug": "gate"
    }, {
      "id": 268272,
      "slug": "japanese-joinery"
    }, {
      "id": 3740,
      "slug": "shrine"
    }, {
      "id": 3741,
      "slug": "torii"
    }],
    "term": "Shinto gateway",
    "term_id": 268271,
    "term_slug": "shinto-gateway",
    "uploader": {
      "location": "Granollers, Barcelona, ES",
      "name": "Lluisa Iborra",
      "permalink": "/marialuisa.iborra",
      "username": "marialuisa.iborra"
    },
    "uploader_id": "2129742",
    "year": 2017
  }
})
  // const maxTries = 3
  // const handler = (numTry) => {
  //   if (numTry < maxTries) {
  //     const randomId = Math.floor(Math.random() * 1538985)
  //     np.getIconById(randomId, (err, data) => {
  //       if (err) {
  //         handler(numTry++)
  //       } else {
  //         res.json(data)
  //       }
  //     })
  //   } else {
  //     res.status(500)
  //   }
  // }
  
  // handler(0)
})

const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`)
})