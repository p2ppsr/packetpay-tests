const authrite = require('authrite-express')
const PacketPay = require('@packetpay/express')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())
const port = 3000

const TEST_SERVER_PRIVATE_KEY = 
'6dcc124be5f382be631d49ba12f61adbce33a5ac14f6ddee12de25272f943f8b'
const TEST_SERVER_BASEURL = `http://localhost:${port}`

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
    return 200
  }
}))

app.post('/sendSomeData', (req, res) => { // costs 200 sats
  console.log(`Received ${req.packetpay.satoshisPaid} satoshis!`)
  res.json({
    message: 'Hello, this is the server.',
    reference: req.packetpay.reference,
    satoshisPaid: req.packetpay.satoshisPaid,
    clientData: req.body
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})