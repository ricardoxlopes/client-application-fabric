import React from 'react'
import Record from './Record'

const RecordsList = ({ records, onRecordClick }) => (
  <ul>
    {records.isFetching && records.records.map((record, index) => (
      <Record key={index} data={record} onClick={() => console.log(index)} />
    ))}
  </ul>
)

export default RecordsList