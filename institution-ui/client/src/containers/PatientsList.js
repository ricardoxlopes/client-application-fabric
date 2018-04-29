import { connect } from 'react-redux'
import { fetchRecords,clickAddRecord } from '../actions'
import PatientsList from '../components/PatientsList'

const mapStateToProps = state => ({
  patients: state.patients
})

const mapDispatchToProps = dispatch => ({
  onPatientClick: patientId => dispatch(fetchRecords(patientId))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PatientsList)