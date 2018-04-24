const records = (state = {
  isFetching: false,
  recordSelected: "",
  patientId: "",
  records: []
}, action) => {
  switch (action.type) {
    // case 'ADD_RECORD':
    //   return Object.assign({}, state, {
    //     patientId: action.patientId
    //   })
    // case 'TRANSACT_RECORD':
    //   return Object.assign({}, state, {
    //     patientId: action.patientId
    //   })
    case 'SELECT_RECORDS':
      return Object.assign({}, state, {
        recordSelected: action.recordId
      })
    case 'REQUEST_RECORDS':
      return Object.assign({}, state, {
        isFetching: true,
        patientId: action.patientId
      })
    case 'RECEIVE_RECORDS':
      return Object.assign({}, state, {
        isFetching: true,
        records: [action.records],
        receivedAt: action.receivedAt
      })
    default:
      return state
  }
}

export default records