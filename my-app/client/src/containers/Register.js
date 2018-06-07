import { connect } from 'react-redux'
import { fetchRegister } from '../actions'
import Register from '../components/Register'

const mapDispatchToProps = dispatch => ({
  onSubmit: (firstName,lastName,email, password) => dispatch(fetchRegister(firstName,lastName,email,password))
})

export default connect(
  null,
  mapDispatchToProps
)(Register)