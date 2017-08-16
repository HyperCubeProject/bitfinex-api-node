'use strict'

const REST = require('./rest.js')
const WS = require('./ws.js')

const defaultTransform = require('./lib/transformer')

const identity = d => d

const BFX = (apiKey, apiSecret, opts = {}) => {

  const { url, websocketURI, autoOpen } = opts
  const transformer = typeof opts.transformer === 'function'
    ? opts.transformer
    : opts.transformer === false ? identity : defaultTransform

  const rest = REST(apiKey, apiSecret, { transformer, url })
  const ws = new WS(apiKey, apiSecret, { transformer, websocketURI, autoOpen })

  return { rest, ws }
}

module.exports = BFX
