/* eslint-env mocha */

'use strict'

const PORT = 1337

const assert = require('assert')
const http = require('http')

const REST2 = require('../rest2.js')
const transformer = require('../lib/transformer.js')

const API_KEY = 'dummy'
const API_SECRET = 'dummy'

const bhttp = REST2(API_KEY, API_SECRET, { transformer, url: `http://localhost:${PORT}` })

const testResBody = `[1765.3,
  0.56800816,
  1767.6,
  1.3874,
  -62.2,
  -0.034,
  1765.3,
  14063.54589155,
  1834.2,
  1726.3 ]`

describe('rest2 api client: transformer', () => {
  it('transforms ticker responses', (done) => {
    const server = http.createServer((req, res) => {
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      })
      res.end(testResBody)
    })

    server.listen(PORT, () => {
      bhttp.ticker('tBTCUSD', (err, res) => {
        assert.equal(err, null)
        assert.deepEqual(
          res,
          { BID: 1765.3,
            BID_SIZE: 0.56800816,
            ASK: 1767.6,
            ASK_SIZE: 1.3874,
            DAILY_CHANGE: -62.2,
            DAILY_CHANGE_PERC: -0.034,
            LAST_PRICE: 1765.3,
            VOLUME: 14063.54589155,
            HIGH: 1834.2,
            LOW: 1726.3
          }
        )

        server.close()
        done()
      })
    })
  })
})
