import { connect } from 'react-redux'
import { fetchRecords } from '../actions'
import OrganizationsList from '../components/OrganizationsList'

const mapStateToProps = state => ({
  orgs: state.organizations
})

const mapDispatchToProps = dispatch => ({
  onOrgClick: channel => dispatch(fetchRecords(channel))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrganizationsList)