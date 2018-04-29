import React from 'react'

const Record = ({ onClick, data,index}) => (
  <tr key={index} onClick={onClick}>
  <td style={{ 'verticalAlign': 'middle' }} >{index}</td>
  <td style={{ 'verticalAlign': 'middle' }} >{JSON.stringify(data)}</td>
  <td style={{ 'verticalAlign': 'middle' }} >{index}</td>
  <td style={{ 'verticalAlign': 'middle' }} >{index}</td>
</tr>
)

export default Record