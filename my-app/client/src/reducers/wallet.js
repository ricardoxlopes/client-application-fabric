const wallet = (state = {
    isFetching: false,
    records: [],
}, action) => {
    switch (action.type) {
        case 'REQUEST_RECORDS':
            return Object.assign({}, state, {
                isFetching: true
            })
        case 'RECEIVE_RECORDS':
            return Object.assign({}, state, {
                isFetching: false,
                records: action.records,
            })
        default:
            return state
    }
}

export default wallet
