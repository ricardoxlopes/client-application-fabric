import {
    ADD_RECORD,
    TRANSACT_RECORD,
    SELECT_RECORDS,
    REQUEST_RECORDS,
    RECEIVE_RECORDS,
    SELECT_PATIENT,
    REQUEST_PATIENTS,
    RECEIVE_PATIENTS
} from './actionTypes'
import fetch from 'cross-fetch'

/*
 * action creators
 */

export const addRecord = (channelId, record) => ({
    type: ADD_RECORD,
    channelId,
    record
})
export const transactRecord = (recordId,channelId,record) => ({
    type: TRANSACT_RECORD,
    recordId,
    channelId,
    record
})
export const selectRecord = (recordId) => ({
    type: SELECT_RECORDS,
    recordId
})
export const requestRecords = (patientId) => ({
    type: REQUEST_RECORDS,
    patientId
})
export const receiveRecords = (jsonRecords) => ({
    type: RECEIVE_RECORDS,
    records: JSON.parse(jsonRecords.records),
    receivedAt: Date.now()
})

export const selectPatient = (patientId) => ({
    type: SELECT_PATIENT,
    patientId
})
export const requestPatients = () => ({
    type: REQUEST_PATIENTS
})
export const receivePatients = (patients) => ({
    type: RECEIVE_PATIENTS,
    patients: patients.patients,
    receivedAt: Date.now()
})

export function fetchRecords(channel) {

    return function (dispatch) {
        dispatch(requestRecords(channel))

        return fetch('/api/BlockchainClis/records',{
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({channel}
            ),
          })
            .then(
                response => response.json(),

                error => console.log('An error occurred.', error)
            )
            .then(records =>
                dispatch(receiveRecords(records))
            )
    }
}

export function fetchPatients() {
    // Thunk middleware knows how to handle functions.
    // It passes the dispatch method as an argument to the function,
    // thus making it able to dispatch actions itself.

    return function (dispatch) {
        // First dispatch: the app state is updated to inform
        // that the API call is starting.

        dispatch(requestPatients())

        // The function called by the thunk middleware can return a value,
        // that is passed on as the return value of the dispatch method.

        // In this case, we return a promise to wait for.
        // This is not required by thunk middleware, but it is convenient for us.

        return fetch('/api/BlockchainClis/patients')
            .then(
                response => response.json(),
                // Do not use catch, because that will also catch
                // any errors in the dispatch and resulting render,
                // causing a loop of 'Unexpected batch number' errors.
                // https://github.com/facebook/react/issues/6895
                error => console.log('An error occurred.', error)
            )
            .then(patients =>
                // We can dispatch many times!
                // Here, we update the app state with the results of the API call.

                dispatch(receivePatients(patients))
            )
    }
}