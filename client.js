const fetch = require('@packetpay/js')

const init = async () => {
  const requestBody = {
    hello: 'Micropayment-powered internet'
  }
  console.log('Request body', requestBody)
  const response = await fetch('http://localhost:3000/sendSomeData', {
    method: 'post',
    body: JSON.stringify(requestBody)
  })
  const body = JSON.parse(Buffer.from(response.body).toString('utf8'))
  console.log('Response body', body)
}
init()
