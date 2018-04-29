import { combineReducers } from 'redux'
import organizations from './organizations'
import wallet from './wallet'
import records from './records'

export default combineReducers({
    organizations,
    wallet,
    records
})