import { connect } from 'react-redux'
import { fetchRecords } from '../actions'
import Wallet from '../components/Wallet'
import { bindActionCreators } from 'redux';

const mapStateToProps = state => ({
  wallet: state.wallet
})

// const mapDispatchToProps = dispatch => ({
//   actions: patientId => dispatch(fetchRecords(patientId))
// })

const mapDispatchToProps = (dispatch) => {
  return {
    actions: {
      onInit: bindActionCreators(fetchRecords, dispatch),
      // counterActions: bindActionCreators(counterActions, dispatch)
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Wallet)