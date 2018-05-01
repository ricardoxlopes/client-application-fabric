const organizations = (state = {
    isFetching: false,
    orgs: [],
    orgsNames: null,
    channels: []
}, action) => {
    switch (action.type) {
        case 'REQUEST_INIT_DATA':
            return Object.assign({}, state, {
                isFetching: true
            })
        case 'RECEIVE_ORGS':
            return Object.assign({}, state, {
                isFetching: false,
                orgs: action.orgs,
                orgsNames: action.orgsNames,
                channels: action.channels,
                receivedAt: action.receivedAt
            })
        case 'SELECT_ORG':
            return Object.assign({}, state, {
                isFetching: true
            })
        default:
            return state
    }
}

export default organizations
