import { connect } from 'react-redux'
import { invokeRecord } from '../actions'
import RecordsList from '../components/RecordsList'

const mapStateToProps = state => ({
  records: state.records
})

const mapDispatchToProps = dispatch => ({
  onRecordClick: (record,channel) => dispatch(invokeRecord(record,channel))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecordsList)