'use strict'
const assert = require('assert')
const express = require('express')

const app = express()

function longOperation (value, cb) {
  // might fail and: return cb(err) ...here

  setTimeout(() => {
    // after some time invokes the callback
    return cb(null, value)
  }, 4000)
}

app.get('/ping', function (req, res) {
  // do some declartions here
  //
  // do some request processesing here

  // call a long op, such as a DB call here.
  // however the client does not need to be
  // informed about the result of the operation
  longOperation(1, (err, val) => {
    assert(!err)
    assert(val === 1)
    console.log('...fired callback here though')
    return
  })

  console.log('sending response here...')
  return res.send('Hello!')
})

let server = app.listen(3000, function () {
  console.log('Starting test:')
})

// client code
const http = require('http')

// after some time, ping the above server
setTimeout(() => {
  let body = ''
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/ping',
    method: 'GET'
  }

  const req = http.request(options, (res) => {
    res.setEncoding('utf8')
    res.on('data', (chunk) => {
      body += chunk
    })
    res.on('end', () => {
      assert(body === 'Hello!')
      console.log('...catching response here and closing server...')
      server.close()
    })
  })

  req.on('error', (e) => {})
  req.end()
}, 2000)
