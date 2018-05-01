const wallet = (state = {
    isFetching: false,
    wallet: null,
    records: [],
    channel: null,
}, action) => {
    switch (action.type) {
        case 'REQUEST_INIT_DATA':
            return Object.assign({}, state, {
                isFetching: true
            })
        case 'RECEIVE_WALLET':
            return Object.assign({}, state, {
                isFetching: false,
                wallet: action.walletInfo,
                channel: action.walletChannel,
                receivedAt: action.receivedAt
            })
        case 'SELECT_WALLET':
            return Object.assign({}, state, {
                isFetching: true
            })
        default:
            return state
    }
}

export default wallet
