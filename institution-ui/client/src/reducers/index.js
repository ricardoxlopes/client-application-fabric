import { combineReducers } from 'redux'
import records from './records'
import patients from './patients'

export default combineReducers({
    records,
    patients
})