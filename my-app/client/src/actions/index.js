import {
    TRANSACT_RECORD,
    SELECT_RECORDS,
    REQUEST_RECORD_INVOKATION,
    REQUEST_RECORDS,
    RECEIVE_RECORDS,
    SELECT_ORG,
    REQUEST_INIT_DATA,
    RECEIVE_ORGS,
    SELECT_WALLET,
    RECEIVE_WALLET
} from './actionTypes'
import fetch from 'cross-fetch'

/*
 * action creators
 */
export const transactRecord = (recordId, channelId, record) => ({
    type: TRANSACT_RECORD,
    recordId,
    channelId,
    record
})
export const selectRecord = (recordId) => ({
    type: SELECT_RECORDS,
    recordId
})
export const requestRecordInvokation = () => ({
    type: REQUEST_RECORD_INVOKATION
})
export const requestRecords = (patientId) => ({
    type: REQUEST_RECORDS,
    patientId
})
export const receiveRecords = (records) => ({
    type: RECEIVE_RECORDS,
    records: JSON.parse(records),
    receivedAt: Date.now()
})
export const selectWallet = (channel) => ({
    type: SELECT_WALLET,
    channel
})
export const receiveWallet = (wallet) => ({
    type: RECEIVE_WALLET,
    walletInfo: JSON.parse(wallet[0]),
    walletRecords: JSON.parse(wallet[1]),
    walletChannel: wallet[2],
    receivedAt: Date.now()
})

export const selectOrg = (channel) => ({
    type: SELECT_ORG,
    channel
})
export const requestInitData = () => ({
    type: REQUEST_INIT_DATA
})
export const receiveOrgs = (orgs, orgsNames, channels) => ({
    type: RECEIVE_ORGS,
    orgs,
    orgsNames,
    channels,
    receivedAt: Date.now()
})

// export function fetchWalletRecords(channel) {

//     return function (dispatch) {

//         dispatch(requestRecords(channel))
//         return fetch('/api/BlockchainClis/records', {
//             method: 'POST',
//             headers: {
//                 Accept: 'application/json',
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ channel }
//             ),
//         })
//             .then(
//                 response => response.json(),

//                 error => console.log('An error occurred.', error)
//             )
//             .then(records => {
//                 console.log("wllaet", records)
//                 dispatch(receiveWalletRecords(records))
//             }
//             )
//     }
// }

//   invoke = async (channel, record) => {
//     const response = await fetch(
//       '/api/BlockchainClis/invoke',
//       {
//         method: 'post',
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ channel: channel, record: record })
//       });

//     var body = await response.json();
//     if (response.status !== 200) throw Error(body.message);
//     return body.res;
//   };

export function invokeRecord(record, channel) {

    return function (dispatch) {

        dispatch(requestRecordInvokation())

        return fetch('/api/BlockchainClis/invoke', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ record: JSON.stringify(record["record"]), channel: channel }),
        })
            .then(
                response => response.json(),

                error => console.log('An error occurred.', error)
            )
            .then(res => {
                console.log(res)
                // dispatch(recordInvoked(res))
            }
            )
    }
}


export function fetchRecords(channel) {

    return function (dispatch) {

        dispatch(selectOrg(channel))
        dispatch(requestRecords(channel))

        return fetch('/api/BlockchainClis/records', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ channel }
            ),
        })
            .then(
                response => response.json(),

                error => console.log('An error occurred.', error)
            )
            .then(records => {
                dispatch(receiveRecords(records.records))
            }
            )
    }
}

export function fetchInitData() {
    // Thunk middleware knows how to handle functions.
    // It passes the dispatch method as an argument to the function,
    // thus making it able to dispatch actions itself.
    return function (dispatch) {
        // First dispatch: the app state is updated to inform
        // that the API call is starting.
        dispatch(requestInitData())

        // The function called by the thunk middleware can return a value,
        // that is passed on as the return value of the dispatch method.

        // In this case, we return a promise to wait for.
        // This is not required by thunk middleware, but it is convenient for us.

        return fetch('/api/BlockchainClis/init')
            .then(
                response => response.json(),
                // Do not use catch, because that will also catch
                // any errors in the dispatch and resulting render,
                // causing a loop of 'Unexpected batch number' errors.
                // https://github.com/facebook/react/issues/6895
                error => console.log('An error occurred.', error)
            )
            .then(data => {
                // We can dispatch many times!
                // Here, we update the app state with the results of the API call.
                dispatch(receiveOrgs(data.info.orgs,data.info.orgsNames,data.info.channels))
                dispatch(selectOrg(data.info.walletRecords[2]))
                dispatch(receiveWallet(data.info.walletRecords))
            }
            )
    }
}