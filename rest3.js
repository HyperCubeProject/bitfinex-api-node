const rp = require('request-promise')
const crypto = require('crypto')

const TIMEOUT = 15000
const DEFAULT_URL = 'https://api.bitfinex.com/'

const factory = (key, secret, opts = {}) => {
  const { transformer } = opts
  const BASE_URL = opts.url || DEFAULT_URL

  const nonceGen = typeof opts.nonceGenerator === 'function'
    ? opts.nonceGenerator
    : () => Date.now()

  const makeAuthRequest = (path, body = {}) => {
    if (!key || !secret) {
      throw new Error('missing api key or secret')
    }

    const v2 = path.includes('v2/')
    const url = `${BASE_URL}/${path}`
    const nonce = JSON.stringify(nonceGen())
    const rawBody = JSON.stringify(body)

    const payload = new Buffer(JSON.stringify(Object.assign({
      request: `/${path}`,
      nonce,
    }, body))).toString('base64')

    const signature = crypto
      .createHmac('sha384', secret)
      .update(v2 ? `/api/${path}${nonce}${rawBody}` : payload)
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

  const makePublicRequest = (name, symbol) => {
    const url = `${BASE_URL}/${name}`

    return rp({
      url,
      method: 'GET',
      timeout: TIMEOUT,
      json: true
    })
    .then(response => transformer(response, name, symbol))
  }

  // timeframes: '1m', '5m', '15m', '30m', '1h', '3h', '6h', '12h', '1D', '7D', '14D', '1M'
  // sections: 'last', 'hist'
  // note: query params can be added: see
  // http://docs.bitfinex.com/v2/reference#rest-public-candles
  const candles = ({timeframe = '1m', symbol = 'tBTCUSD', section = 'hist', query = ''}) =>
    makePublicRequest(`v2/candles/trade:${timeframe}:${symbol}/${section}?${query}`, symbol)

  return {
    makeAuthRequest,
    makePublicRequest,
    candles,
  }
}

module.exports = factory
