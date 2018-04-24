import React from 'react'

const Patient = ({ onClick, data }) => (
  <li
    onClick={onClick}
  //   style={ {
  //     textDecoration: completed ? 'line-through' : 'none'
  //   }}
  >
    {data}
  </li>
)

export default Patient