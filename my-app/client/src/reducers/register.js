const register = (state = {
    isFetching: false,
}, action) => {
    switch (action.type) {
        case 'SUBMIT_REGISTER':
            return Object.assign({}, state, {
                isFetching: true,
            })
        default:
            return state
    }
}

export default register
