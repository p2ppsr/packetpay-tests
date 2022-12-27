const authrite = require('authrite-express')
const PacketPay = require('@packetpay/express')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())

const port = 3000
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

// Test route for accessing blog post content through the PacketPay paywall
app.get('/blog/1', (req, res) => { // costs 200 sats
  console.log(`Received ${req.packetpay.satoshisPaid} satoshis!`)
  res.json({
    title: 'Users',
    content: "Users are at the heart of the Babbage ecosystem. Every app is used by them, and every Action taken by them. Their privacy is protected by keys that only they have, and their identity is certified by organizations trusted by their peers. As they go about their lives, their decisions make their mark on the timechain of history." + 
    "<br> <br>To participate in the MetaNet, a user will need a MetaNet Portal. The Portal can be viewed in the same way as a web browser — managing the user's keys and helping with permissions. The Portal allows the user to log into their singular MetaNet account, protect their data and store their bitcoins. Instead of plugging into every app and website individually, the MetaNet Portal allows programs and software to plug into a single user identity." + 
    "<br> <br>Through the concepts on this page, you will learn how to give users more power than they have ever had before. You will learn to create new kinds of applications from the ground up, and re-purpose existing ones in ways you never thought were possible. As you read, you can use the cards at the bottom of the page to move back and forward, or find more information with the menu on the left.",
    key: 'MYQQx52TdvvnxNDoXw47AsEMDjMmA8Mq4z7j5QeS7bk=',
    encryptedContent: 'cPRdRdGu4U0Tao+fyx+zF/R58id8vBXfjWbH0N2G2/B4Kf/sh1I0WFNEcdGGn7L3dmvmZxcuXzvlbFb1jskCl6EpzlgIpJUEz0AsuT4U9yaQ7JabmFVt1DvFNCSwf2sFvQ5CRaxFP3pFLoq5otLFeowYWsVEKsF2ZwTeIZEpQ6bin8k+zaise6aJsFbdnIQL9UJWm0t5onTm3y51QbUPL0Trsk53waiFaKg4ZAsYf5dMwcKzcj6g0/MYiSSqmFSLPvOjqzTr8ZA+5Bwp3p4sdlVYtnSAMcJ7U0DjVkdiO9z6eiQ+D0ZuJzraBIqoMPtz/95FUccX8StCdltpMoIO3nbEspWLo6rrqTyKOw+CaHeG0e6zIzA2zhSKQwdmwclZEOphO3YXth0isvMJiDIjmOy2PeuvcUQECE9OFMYTpZTI/n/aVon5TlgfMFb15eN1xjMy3/mIG7qyi/TLsJnlJAMWLdXiw4iY1LqT8ranpKsbhNhWzD/hHH7ZAVb/CQL7WONzlEAPZBgzMWBECoB5pUotojU9TYkEEYYzX/1vK0C+ZJQalOIoYB2MNjI6QcjkH7Gk4hnibLiTU6F0ZWd2XKOWiUHR/EchDvVtS9goCGJunsIQCmX6FtgPUVnZrtJ2zpfITgUO0xFxxyjw+2pmo44vNMY55KZe2IndLyL962iq7EGWEmP1ysPG1Yz/I+p3XWNtlh2jzgSj+xLKRw8ypVqGn0Et8xd15uf20J+RL5LpAjqEt9d0MbQ2KbaxRQPsO59ps/3Yhn/XOF/kFaekSvgqhzSCfm4HUzZhKEJI437+zMdgcJv7rd+hC1ccSj6D4a0NEQR2w8JAH4Q4pVZ/R9nP3Aimw+cQvJwirB/KvKdkgPnwF0DPWNocwuZzCm6hMqf4NkwDIH2U9pZGXptE1f/FrS2JrPP3Ms6YGAi0e6Z8MqSBuITEExEVgNRxJVJdqHu+iacaphCWo32u9MQpVH4Wm6HpFTg6wJCuJg1s/pbTFMTL8hdCEW7Y5nWm+tTyyjIyrBmvlAEuXFnluaYMCWh7hn+7o3u+E+FAguW+JGkKOYxOyejFXQ2Yz983k1LFTVBBiLCZ8Ngl5irjeSwZGbKemXc3TD+kOvNSac8BDkF8pkJ3WisXpDR/zAS64FHkmNW4YAPWNFc720hJ6ZwHbslEqraKPOVVkWqcuyQiO9cCgSiLoLkRWrE4uqKU0oWDip1ypOH9lSCRLEDsA+VPST1qipUoC17vs2xqJloJpr6zEB7Qp53YHoxHflwc+ax5QOmjICDj55fF6in02AfARCxOk93HpVoCVLZ1jVIigQZTp2X19vZpWRBG2fO7/ksLOOzoZIPuKK7pvd+nEKFJjO9595X3m5HxXIXlwXTrkUiGu/WMPZeB7Ap1rZJtLF5W/IElx3na7a1av6k/Blj0Q/BVrQVlGFVz530nVHLOmLKp4BFnYKtjNtQBQ7tklCe3NE5GndeKiTewVqNnNYVchzC66gk1nr/9brNNAluUAsEiK/R4LJ4axpw527uJAxbnjL6GpS+xkYqShSTdKVZu44flyv4aGiSlB7F5QfGtVKfqosJvdnhIeecChD3A4aUIhd4HSykL1cSoqA6IqnjN7B43htU7y2E2G6g3'
  })
})

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