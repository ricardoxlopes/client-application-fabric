import { connect } from 'react-redux'
import { fetchLogin } from '../actions'
import Login from '../components/Login'

const mapDispatchToProps = dispatch => ({
  onSubmit: (email, password) => dispatch(fetchLogin(email, password))
})

export default connect(
  null,
  mapDispatchToProps
)(Login)