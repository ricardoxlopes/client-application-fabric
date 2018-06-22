const permissions = (state = {
    isFetching: false,
    ids: [],
    orgs: [],
    allPermissions: []
}, action) => {
    switch (action.type) {
        case 'REQUEST_ALL_PERMISSIONS':
            return Object.assign({}, state, {
                isFetching: true
            })
        case 'RECEIVE_ALL_PERMISSIONS':
            return Object.assign({}, state, {
                isFetching: false,
                allPermissions: action.allPermissions,
            })
        case 'REQUEST_ALL_IDS':
            return Object.assign({}, state, {
                isFetching: true,
            })
        case 'RECEIVE_ALL_IDS':
            return Object.assign({}, state, {
                isFetching: false,
                ids: action.ids,
                orgs: action.orgs
            })
        default:
            return state
    }
}

export default permissions
