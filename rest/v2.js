const zip = require('lodash/zipObject')

const maps = require('../lib/maps')

const doTransform = (data, map, symbolOrCurrency) => {
  if (!map) { return data }

  const sub = symbolOrCurrency[0] === 'f' ? 'fundingCurrencies' : 'tradingPairs'
  const mapping = map[sub]

  if (!mapping) { return data }

  return zip(data[0] === symbolOrCurrency ? ['SYMBOL'].concat(mapping) : mapping, data)
}

const transform = (data, map, symbolOrCurrency) =>
  Array.isArray(data[0])
    ? data.map(d => doTransform(d, map, symbolOrCurrency || d[0]))
    : doTransform(data, map, symbolOrCurrency)

module.exports = (makePublicRequest, makeAuthRequest) => ({
  // Get a ticker for a specific symbol
  ticker: (symbol = 'tBTCUSD') => makePublicRequest(`/v2/ticker/${symbol}`)
    .then(data => transform(data, maps.ticker, symbol)),

  // Retrieve all tickers
  tickers: (symbols = []) => makePublicRequest(`/v2/tickers?symbols=${symbols.join(',')}`)
    .then(data => transform(data, maps.ticker)),

  // Get the candles
  candles: (timeframe = '1m', symbol = 'tBTCUSD', section = 'hist', query = '') =>
    makePublicRequest(`v2/candles/trade:${timeframe}:${symbol}/${section}?${query}`)
      .then(data => transform(data, maps.candles, symbol)),

  // Retrieve stats
  stats: (key = 'pos.size:1m:tBTCUSD:long', context = 'hist') =>
    makePublicRequest(`/v2/stats1/${key}/${context}`),

  // List all the alerts already set
  alertList: (type = 'price') =>
    makeAuthRequest('/v2/auth/r/alerts', { type }),

  // Set an alert on a symbol price
  alertSet: (symbol = 'tBTCUSD', price = 0, type = 'price') =>
    makeAuthRequest('/v2/auth/w/alert/set', { type, symbol, price }),

  // Remove an alert based on a symbol and price
  alertDelete: (symbol = 'tBTCUSD', price = 0) =>
    makeAuthRequest('/v2/auth/w/alert/set', { symbol, price }),

  // Retrieve trade history
  trades: (symbol = 'tBTCUSD', start = null, end = null, limit = null) =>
    makeAuthRequest(`/v2/auth/r/trades/${symbol}/hist`, { start, end, limit })
})
