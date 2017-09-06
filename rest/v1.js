module.exports = (makePublicRequest, makeAuthRequest) => {

  const ticker = (symbol = 'BTCUSD') =>
    makePublicRequest(`/v1/pubticker/${symbol}`)

  const today = (symbol = 'BTCUSD') =>
    makePublicRequest(`/v1/today/${symbol}`)

  const stats = (symbol = 'BTCUSD') =>
    makePublicRequest(`/v1/stats/${symbol}`)

  const fundingBook = (currency = 'BTC', options = {}) =>
    makePublicRequest(`/v1/lendbook/${currency}`, options)

  const orderBook = (symbol = 'BTCUSD', options = {}) =>
    makePublicRequest(`/v1/book/${symbol}`, options)

  const trades = (symbol = 'BTCUSD') =>
    makePublicRequest(`/v1/trades/${symbol}`)

  const lends = (currency = 'BTC') =>
    makePublicRequest(`/v1/lends/${currency}`)

  const getSymbols = () =>
    makePublicRequest('/v1/symbols')

  const symbolsDetails = () =>
    makePublicRequest('/v1/symbols_details')

  const newOrder = (symbol, amount, price, exchange, side, type, isHidden, postOnly) => {

    const params = {
      symbol,
      amount,
      price,
      exchange,
      side,
      type,
    }

    if (postOnly) { params.post_only = true }
    if (isHidden) { params.is_hidden = true }

    return makeAuthRequest('/v1/order/new', params)

  }

  const multiNewOrders = orders =>
    makeAuthRequest('/v1/order/new/multi', { orders })

  const cancelOrder = oderId =>
    makeAuthRequest('/v1/order/cancel', { order_id: parseInt(orderId, 10) })

  const cancelAllOrders = () =>
    makeAuthRequest('/v1/order/cancel/all')

  const multiCancelOrders = ordersIds =>
    makeAuthRequest('/v1/order/cancel/multi', { order_ids: ordersIds.map(i => parseInt(i, 10)) })

  const replaceOrder = (orderId, symbol, amount, price, exchange, side, type) =>
    makeAuthRequest('/v1/order/cancel/replace', {
      order_id: parseInt(orderId, 10),
      symbol,
      amount,
      price,
      exchange,
      side,
      type,
    })

  const orderStatus = orderId =>
    makeAuthRequest('/v1/order/status', { order_id: parseInt(orderId, 10) })

  const activeOrders = () =>
    makeAuthRequest('/v1/orders')

  const orderHistory = () =>
    makeAuthRequest('/v1/orders/hist')

  const activePositions = () =>
    makeAuthRequest('/v1/positions')

  const claimPosition = (positionId, amount) =>
    makeAuthRequest('/v1/position/claim', { position_id: parseInt(positionId, 10), amount })

  const balanceHistory = (currency = 'BTC', options = {}) =>
    makeAuthRequest('/v1/history', Object.assign({ currency }, options))

  const movements = (currency = 'BTC', options = {}) =>
    makeAuthRequest('/v1/history/movements', Object.assign({ currency }, options))

  const pastTrades = (symbol = 'BTCUSD', options) =>
    makeAuthRequest('/v1/mytrades', Object.assign({ symbol }, options))

  const newDeposit = (currency, method, wallet_name) =>
    makeAuthRequest('/v1/deposit/new', { currency, method, wallet_name })

  const newOffer = (currency, amount, rate, period, direction) =>
    makeAuthRequest('/v1/offer/new', { currency, amount, rate, period, direction })

  const cancelOffer = offerId =>
    makeAuthRequest('/v1/offer/cancel', { offer_id: parseInt(offerId, 10) })

  const offerStatus = offerId =>
    makeAuthRequest('/v1/offer/status', { offer_id: parseInt(offerId, 10) })

  const activeOffers = () =>
    makeAuthRequest('/v1/offers')

  const activeCredits = () =>
    makeAuthRequest('/v1/credits')

  const walletBalances = () =>
    makeAuthRequest('/v1/balances')

  const takenSwaps = () =>
    makeAuthRequest('/v1/taken_funds')

  const totalTakenSwaps = () =>
    makeAuthRequest('/v1/total_taken_funds')

  const closeSwap = swapId =>
    makeAuthRequest('/v1/swap/close', { swap_id: parseInt(swapId, 10) })

  const accountInfos = () =>
    makeAuthRequest('/v1/account_infos')

  const marginInfos = () =>
    makeAuthRequest('/v1/margin_infos')

  const withdraw = (withdraw_type, walletselected, amount, address) =>
    makeAuthRequest('/v1/withdraw', { withdraw_type, walletselected, amount, address })

  const transfer = (amount, currency, walletfrom, walletto) =>
    makeAuthRequest('/v1/transfer', { amount, currency, walletfrom, walletto })

  return {
    ticker,
    today,
    stats,
    fundingBook,
    orderBook,
    trades,
    lends,
    getSymbols,
    symbolsDetails,
    newOrder,
    multiNewOrders,
    cancelOrder,
    cancelAllOrders,
    multiCancelOrders,
    replaceOrder,
    orderStatus,
    activeOrders,
    orderHistory,
    activePositions,
    claimPosition,
    balanceHistory,
    movements,
    pastTrades,
    newDeposit,
    newOffer,
    cancelOffer,
    offerStatus,
    activeOffers,
    activeCredits,
    walletBalances,
    takenSwaps,
    totalTakenSwaps,
    closeSwap,
    accountInfos,
    marginInfos,
    withdraw,
    transfer,
  }
}
