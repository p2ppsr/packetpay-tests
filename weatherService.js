const authrite = require('authrite-express')
const PacketPay = require('@packetpay/express')
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('isomorphic-fetch')
const payFetch = require('@packetpay/js')
const app = express()
app.use(bodyParser.json())
const port = 3000

const TEST_SERVER_PRIVATE_KEY = 
'6dcc124be5f382be631d49ba12f61adbce33a5ac14f6ddee12de25272f943f8b'
const TEST_SERVER_BASEURL = `http://localhost:${port}`

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  res.header('Access-Control-Allow-Methods', '*')
  res.header('Access-Control-Expose-Headers', '*')
  res.header('Access-Control-Allow-Private-Network', 'true')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  } else {
    next()
  }
})

// Default route requests the description of the current weather
app.get('/', async (req, res) => {
  try {
    const response = await payFetch('http://localhost:3000/weatherStats')
    const body = JSON.parse(Buffer.from(response.body).toString('utf8'))
    res.json(`Thank you for your payment! Here is the current weather conditions: ${body.weather[0].description}`)
  } catch (error) {
   res.json(error) 
  }
})

// Before any PacketPay middleware, set up the server for Authrite
app.use(authrite.middleware({
    serverPrivateKey: TEST_SERVER_PRIVATE_KEY,
    baseUrl: TEST_SERVER_BASEURL
}))

// Configure the express server to use the PacketPay middleware
app.use(PacketPay({
  serverPrivateKey: TEST_SERVER_PRIVATE_KEY,
  ninjaConfig: {
    // Use the Babbage staging testnet Dojo
    dojoURL: 'https://staging-dojo.babbage.systems'
  },
  calculateRequestPrice: req => {
    return 333
  }
}))

app.post('/weatherStats', async (req, res) => {
  console.log(`Received ${req.packetpay.satoshisPaid} satoshis!`)
  const response = await fetch(
    'https://openweathermap.org/data/2.5/weather?id=5746545&appid=439d4b804bc8187953eb36d2a8c26a02',
    { method: 'GET' }).then(
    response => response.json()
  )
  res.json(response)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})