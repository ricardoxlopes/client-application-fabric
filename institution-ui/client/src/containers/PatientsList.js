import { connect } from 'react-redux'
import { selectPatient } from '../actions'
import PatientsList from '../components/PatientsList'

const mapStateToProps = state => ({
  patients: state.patients
})

const mapDispatchToProps = dispatch => ({
    requestPatients: patientId => dispatch(selectPatient(patientId))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PatientsList)