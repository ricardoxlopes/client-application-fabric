const records = (state = {
    isFetching: false,
    records: null,
    channels: [],
    orgsNames: [],
    selectedChannel: null
}, action) => {
    switch (action.type) {
        case 'REQUEST_INIT_DATA':
            return Object.assign({}, state, {
                isFetching: true
            })
        case 'RECEIVE_ORGS':
            return Object.assign({}, state, {
                isFetching: false,
                channels: action.channels,
                orgsNames: action.orgsNames
            })
        case 'RECEIVE_WALLET':
            return Object.assign({}, ...state, {
                isFetching: false,
                records: action.walletRecords,
                channels: state.channels.concat(action.walletChannel),
                orgsNames: state.orgsNames.concat(action.walletInfo["name"]),
                selectedChannel: action.walletChannel,
                receivedAt: action.receivedAt
            })
        case 'RECEIVE_RECORDS':
            return Object.assign({}, state, {
                isFetching: false,
                records: action.records,
                receivedAt: action.receivedAt
            })
        case 'SELECT_ORG':
            return Object.assign({},state, {
                selectedChannel: action.channel
            })
        default:
            return state
    }
}

export default records
