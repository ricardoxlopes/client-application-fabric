import { connect } from 'react-redux'
import { fetchRecords } from '../actions'
import Wallet from '../components/Wallet'

const mapStateToProps = state => ({
  wallet: state.wallet
})

const mapDispatchToProps = dispatch => ({
  onWalletClick: channel => dispatch(fetchRecords(channel))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Wallet)