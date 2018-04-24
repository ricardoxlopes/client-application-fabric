const patients = (state = {
    isFetching: false,
    patientSelected: "",
    patients: []
}, action) => {
    switch (action.type) {
        case 'SELECT_PATIENT':
            return Object.assign({}, state, {
                patientSelected: action.patientId
            })
        case 'REQUEST_PATIENTS':
            return Object.assign({}, state, {
                isFetching: true
            })
        case 'RECEIVE_PATIENTS':
            return Object.assign({}, state, {
                isFetching: true,
                patients: [action.patients],
                receivedAt: action.receivedAt
            })
        default:
            return state
    }
}

export default patients
