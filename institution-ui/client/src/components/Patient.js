import React from 'react'

const Patient = ({ onClick, data, index }) => (
  <tr key={index} onClick={onClick}>
    <td style={{ 'verticalAlign': 'middle' }} >{data}</td>
    <td style={{ 'verticalAlign': 'middle' }} >{data}</td>
    <td style={{ 'verticalAlign': 'middle' }} >{data}</td>
    <td style={{ 'verticalAlign': 'middle' }} >{data}</td>
  </tr>
)

export default Patient