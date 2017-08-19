const rp = require('request-promise')
const crypto = require('crypto')

const TIMEOUT = 15000
const BASE = 'https://api.bitfinex.com/'
const VERSION = 'v2'

const factory = (key, secret, opts = {}) => {
  const { transformer } = opts
  const URL = opts.url || BASE

  const nonceGen = typeof opts.nonceGenerator === 'function'
    ? opts.nonceGenerator
    : () => Date.now()

  const makeAuthRequest = (path, body = {}) => {
    if (!key || !secret) {
      throw new Error('missing api key or secret')
    }

    const url = `${URL}/${VERSION}/${path}`
    const nonce = JSON.stringify(nonceGen())
    const rawBody = JSON.stringify(body)

    const signature = crypto
      .createHmac('sha384', secret)
      .update(`/api/${VERSION}${path}${nonce}${rawBody}`)
      .digest('hex')

    return rp({
      url,
      method: 'POST',
      json: true,
      headers: {
        'bfx-nonce': nonce,
        'bfx-apikey': key,
        'bfx-signature': signature
      },
      body,
    })
  }

  const makePublicRequest = name => {
    const url = `${URL}/${VERSION}/${name}`

    return rp({
      url,
      method: 'GET',
      timeout: TIMEOUT,
      json: true
    })
    .then(response => transformer(response, name))
  }

  // Public endpoints

  const ticker = (symbol = 'tBTCUSD') =>
    makePublicRequest(`ticker/${symbol}`)

  const tickers = () =>
    makePublicRequest('tickers')

  const stats = (key = 'pos.size:1m:tBTCUSD:long', context = 'hist') =>
    makePublicRequest(`stats1/${key}/${context}`)

  // timeframes: '1m', '5m', '15m', '30m', '1h', '3h', '6h', '12h', '1D', '7D', '14D', '1M'
  // sections: 'last', 'hist'
  // note: query params can be added: see
  // http://docs.bitfinex.com/v2/reference#rest-public-candles
  const candles = ({timeframe = '1m', symbol = 'tBTCUSD', section = 'hist', query = ''}) =>
    makePublicRequest(`candles/trade:${timeframe}:${symbol}/${section}?${query}`)

  const trades = ({ symbol = 'tBTCUSD' }) =>
    makePublicRequest(`trades/${symbol}/hist`)

  const lends = ({ currency = 'BTC' }) =>
    makePublicRequest(`lends/${symbol}`)

  // Auth endpoints

  const alertList = (type = 'price') =>
    makeAuthRequest(`auth/r/alerts?type=${type}`, null)

  const alertSet = (type = 'price', symbol = 'tBTCUSD', price = 0) =>
    makeAuthRequest('auth/w/alert/set', { type, symbol, price })

  const alertDelete = (symbol = 'tBTCUSD', price = 0) =>
    makeAuthRequest('auth/w/alert/set', { symbol, price })

  // TODO
  // - Trades
  // - Books
  // - Wallets
  // - Orders
  // - Order Trades
  // - Positions
  // - Offers
  // - Margin Info
  // - Funding Info
  // - Performance
  // - Calc Available Balance

  return {
    makeAuthRequest,
    makePublicRequest,

    ticker,
    tickers,
    stats,
    candles,
    trades,
    lends,

    alertList,
    alertSet,
    alertDelete
  }
}

module.exports = factory
