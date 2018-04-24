import { connect } from 'react-redux'
import { selectRecord } from '../actions'
import RecordsList from '../components/RecordsList'

const mapStateToProps = state => ({
  records: state.records
})

const mapDispatchToProps = dispatch => ({
  selectRecord: recordId => dispatch(selectRecord(recordId))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecordsList)