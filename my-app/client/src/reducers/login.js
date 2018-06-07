const login = (state = {
    isFetching: false,
}, action) => {
    switch (action.type) {
        case 'SUBMIT_LOGIN':
            return Object.assign({}, state, {
                isFetching: true,
            })
        default:
            return state
    }
}

export default login
