const rp = require('request-promise')
const crypto = require('crypto')

const api1 = require('./v1')
const api2 = require('./v2')

const TIMEOUT = 15000
const DEFAULT_URL = 'https://api.bitfinex.com'

const factory = (key, secret, opts = {}) => {
  const BASE_URL = opts.url || DEFAULT_URL

  const nonceGen = typeof opts.nonceGenerator === 'function'
    ? opts.nonceGenerator
    : () => {
      const [seconds, nano] = process.hrtime()
      return seconds * 1E9 + nano * 1E3
    }

  const makeAuthRequest = (path, body = {}) => {
    if (!key || !secret) {
      throw new Error('missing api key or secret')
    }

    const v2 = path.includes('v2/')
    const url = `${BASE_URL}${path}`
    const nonce = JSON.stringify(nonceGen())
    const rawBody = JSON.stringify(body)

    const payload = new Buffer(JSON.stringify(Object.assign({
      request: path,
      nonce,
    }, body))).toString('base64')

    const signature = crypto
      .createHmac('sha384', secret)
      .update(v2 ? `/api${path}${nonce}${rawBody}` : payload)
      .digest('hex')

    return rp({
      url,
      method: 'POST',
      json: true,
      headers: v2 ? {
        'bfx-nonce': nonce,
        'bfx-apikey': key,
        'bfx-signature': signature
      } : {
        'X-BFX-APIKEY': key,
        'X-BFX-PAYLOAD': payload,
        'X-BFX-SIGNATURE': signature,
      },
      body: v2 ? body : undefined,
    })
  }

  const makePublicRequest = (name, query = {}) => {
    const url = `${BASE_URL}/${name}`

    return rp({
      url,
      method: 'GET',
      timeout: TIMEOUT,
      json: true,
      qs: query,
    })
  }

  return {
    makeAuthRequest,
    makePublicRequest,

    v1: api1(makePublicRequest, makeAuthRequest),
    v2: api2(makePublicRequest, makeAuthRequest),
  }
}

module.exports = factory
