const records = (state = {
    isFetching: false,
    records: null
}, action) => {
    switch (action.type) {
        case 'REQUEST_INIT_DATA':
            return Object.assign({}, state, {
                isFetching: true
            })
        case 'RECEIVE_ORGS':
            return Object.assign({}, state, {
                isFetching: false,
                channels: action.channels
            })
        case 'RECEIVE_RECORDS':
            return Object.assign({}, state, {
                isFetching: false,
                records: action.records,
                receivedAt: action.receivedAt
            })
        case 'RECEIVE_WALLET':
            return Object.assign({}, state, {
                isFetching: false,
                records: action.walletRecords,
                receivedAt: action.receivedAt
            })
        case 'RECEIVE_WALLET_RECORDS':
            return Object.assign({}, state, {
                isFetching: false,
                records: action.walletRecords,
                receivedAt: action.receivedAt
            })
        default:
            return state
    }
}

export default records
