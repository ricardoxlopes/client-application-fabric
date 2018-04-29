const organizations = (state = {
    isFetching: false,
    selectedOrg: null,
    orgs: [],
    channnels: []
}, action) => {
    switch (action.type) {
        case 'SELECT_ORG':
            return Object.assign({}, state, {
                selectedOrg: action.selectedOrg
            })
        case 'REQUEST_INIT_DATA':
            return Object.assign({}, state, {
                isFetching: true
            })
        case 'RECEIVE_ORGS':
            return Object.assign({}, state, {
                isFetching: false,
                orgs: action.orgs,
                channels: action.channels,
                receivedAt: action.receivedAt
            })
        default:
            return state
    }
}

export default organizations
