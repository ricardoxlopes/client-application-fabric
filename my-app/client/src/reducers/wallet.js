const wallet = (state = {
    isFetching: false,
    wallet: null,
    records: []
}, action) => {
    switch (action.type) {
        case 'SELECT_WALLET':
            return Object.assign({}, state, {
                isFetching: true
            })
        case 'REQUEST_INIT_DATA':
            return Object.assign({}, state, {
                isFetching: true
            })
        case 'RECEIVE_WALLET_RECORDS':
            return Object.assign({}, state, {
                isFetching: false,
                // records: action.walletRecords,
                receivedAt: action.receivedAt
            })
        case 'RECEIVE_WALLET':
            return Object.assign({}, state, {
                isFetching: false,
                wallet: action.walletInfo,
                // records: action.walletRecords,
                receivedAt: action.receivedAt
            })
        default:
            return state
    }
}

export default wallet
