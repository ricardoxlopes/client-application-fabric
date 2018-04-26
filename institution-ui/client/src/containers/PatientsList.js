import { connect } from 'react-redux'
import { fetchRecords } from '../actions'
import PatientsList from '../components/PatientsList'

const mapStateToProps = state => ({
  patients: state.patients
})

const mapDispatchToProps = dispatch => ({
  onPatientClick: patientId => dispatch(fetchRecords("mychannel1"))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PatientsList)