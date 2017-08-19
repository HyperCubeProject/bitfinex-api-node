'use strict'

const REST = require('./rest3.js')
const WS2 = require('./ws2.js')

const defaultTransform = require('./lib/transformer')

const identity = d => d

const BFX = (apiKey, apiSecret, opts = {}) => {

  const { url, websocketURI, autoOpen } = opts
  const transformer = typeof opts.transformer === 'function'
    ? opts.transformer
    : opts.transformer === false ? identity : defaultTransform

  const rest = REST(apiKey, apiSecret, { transformer, url })
  const ws = new WS2(apiKey, apiSecret, { transformer, websocketURI, autoOpen })

  return { rest, ws }
}

module.exports = BFX
