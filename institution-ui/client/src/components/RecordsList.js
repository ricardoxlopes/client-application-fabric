import React from 'react'
import Record from './Record'

const RecordsList = ({ records, onRecordClick }) => (
  <table className="table table-striped table-hover">
    <thead className="thead-dark">
      <tr>
        <th>#</th>
        <th>Record</th>
        <th>Source</th>
        <th>Sharing</th>
      </tr>
    </thead>
    <tbody>
      {records.isFetching && records.records.map((record, index) => (
        <Record key={index} index={index} data={record} onClick={record => onRecordClick(record)} />
      ))}
    </tbody>
  </table>
)

export default RecordsList