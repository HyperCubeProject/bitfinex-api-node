'use strict'

const zipObject = require('lodash/zipObject')

const maps = require('./maps')
const { isSnapshot } = require('./helper.js')

const normalize = name => {
  if (!name) return

  const type = name.split('/')[0]
  const symbol = name.split('/')[1]

  return { type, symbol }
}

const getSubtype = symbol =>
  (/^t/).test(symbol) ? 'tradingPairs' : 'fundingCurrencies'

const transform = (data, name, s) => {
  const norm = normalize(name)
  const { type } = norm
  const symbol = s || norm.symbol
  const subtype = getSubtype(symbol)

  if (!maps[type]) return data

  const props = maps[type][subtype]

  if (data[0] === 'tu' || data[0] === 'te') {
    data[1] = zipObject(props, data[1])
    return data
  }

  if (!isSnapshot(data)) {
    return zipObject(props, data)
  }

  const res = data.map((list) => {
    return zipObject(props, list)
  })

  return res
}

module.exports = transform
