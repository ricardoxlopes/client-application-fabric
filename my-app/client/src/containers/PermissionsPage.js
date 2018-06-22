import { connect } from 'react-redux'
import { fetchAllPermissions, fetchAllIds } from '../actions'
import PermissionsPage from '../components/PermissionsPage'
import { bindActionCreators } from 'redux';

const mapStateToProps = state => ({
  allPermissions: state.permissions.allPermissions,
  ids: state.permissions.ids,
  orgs: state.permissions.orgs
})

const mapDispatchToProps = (dispatch) => {
  return {
    actions: {
      onInitPermissions: bindActionCreators(fetchAllPermissions, dispatch),
      onInitIds: bindActionCreators(fetchAllIds, dispatch)
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PermissionsPage)