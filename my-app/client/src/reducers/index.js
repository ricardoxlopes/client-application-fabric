import { combineReducers } from 'redux'
// import organizations from './organizations'
import wallet from './wallet'
// import records from './records'
import login from './login'
import permissions from './permissions'

export default combineReducers({
    // organizations,
    // wallet,
    // records,
    login,
    wallet,
    permissions
})