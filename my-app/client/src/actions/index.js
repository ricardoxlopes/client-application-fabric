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
    RECEIVE_WALLET,
    SUBMIT_LOGIN,
    SUBMIT_REGISTER,
    MANAGE_PERMISSIONS,
    REQUEST_ALL_PERMISSIONS,
    RECEIVE_ALL_PERMISSIONS,
    REQUEST_ALL_IDS,
    RECEIVE_ALL_IDS
} from './actionTypes'
import fetch from 'cross-fetch'

const ACCESS_TOKEN_KEY = "access_token_key"
const ACCESS_TOKEN_EXPIRATION_TIME = "access_token_expiration_time"

/*
 * action creators
 */

export const submitLogin = () => ({
    type: SUBMIT_LOGIN,
})

export const submitRegister = () => ({
    type: SUBMIT_REGISTER,
})

export const managePermissions = () => ({
    type: MANAGE_PERMISSIONS,
})

export const requestAllPermissions = () => ({
    type: REQUEST_ALL_PERMISSIONS,
})
export const receiveAllPermissions = (permissions) => ({
    type: RECEIVE_ALL_PERMISSIONS,
    allPermissions: permissions["permissions"]
})
export const requestAllIds = () => ({
    type: REQUEST_ALL_IDS,
})
export const receiveAllIds = (ids) => ({
    type: RECEIVE_ALL_IDS,
    orgs: ids["ids"][0],
    ids: ids["ids"][1]
})

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
    records: records,
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

export function fetchRegister(firstName, lastName, email, password) {

    return function (dispatch) {

        dispatch(submitRegister())

        return fetch('/api/gChainIds/registerPatient', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ firstName: firstName, lastName: lastName, email: email, password: password }),
        }).then(response => {
            console.log(response)
        }).catch(err => {
            console.log(err);
        });
    }
}

export function fetchLogin(email, password) {

    return function (dispatch) {

        dispatch(submitLogin())

        return fetch('/api/gChainIds/loginPatient', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, password: password }),
        }).then(response => {
            console.log(response)
            // localStorage.setItem(ACCESS_TOKEN_KEY, response.token);
            // let whenExpires = new
            // localStorage.setItem(ACCESS_TOKEN_EXPIRATION_TIME,expirationTime);
        }).catch(err => {
            console.log(err);
        });
    }
}

export function fetchAllIds(patientId) {

        return function (dispatch) {

            dispatch(requestAllIds())

            return fetch('/api/gChainIds/getAllPrivateIds?patientId=' + patientId).then(
                response => response.json(),
                // Do not use catch, because that will also catch
                // any errors in the dispatch and resulting render,
                // causing a loop of 'Unexpected batch number' errors.
                // https://github.com/facebook/react/issues/6895
                error => console.log('An error occurred.', error)
            ).then(ids => {
                console.log(ids)
                console.log(ids["ids"])
                dispatch(receiveAllIds(ids));
                dispatch(fetchAllPermissions({"ids":ids["ids"][1]}))
            }
            )
        }
}

export function fetchAllPermissions(patientIds) {

    return function (dispatch) {

        dispatch(requestAllPermissions())

        return fetch('/api/BlockchainClis/getAllPermissions', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ patientIds: patientIds }),
        }).then(
            response => response.json(),
            // Do not use catch, because that will also catch
            // any errors in the dispatch and resulting render,
            // causing a loop of 'Unexpected batch number' errors.
            // https://github.com/facebook/react/issues/6895
            error => console.log('An error occurred.', error)
        ).then(permissions => {
            console.log(permissions)
            dispatch(receiveAllPermissions(permissions));
        });
    }
}

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


export function fetchRecords(patientId) {

    return function (dispatch) {

        // dispatch(selectOrg(channel))
        dispatch(requestRecords())

        return fetch('/api/gChainRecords/getRecords?patientId=' + patientId).then(
            response => response.json(),
            // Do not use catch, because that will also catch
            // any errors in the dispatch and resulting render,
            // causing a loop of 'Unexpected batch number' errors.
            // https://github.com/facebook/react/issues/6895
            error => console.log('An error occurred.', error)
        ).then(data => {
            dispatch(receiveRecords(data.records))
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
                dispatch(receiveOrgs(data.info.orgs, data.info.orgsNames, data.info.channels))
                dispatch(selectOrg(data.info.walletRecords[2]))
                dispatch(receiveWallet(data.info.walletRecords))
            }
            )
    }
}