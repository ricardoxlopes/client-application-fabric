import React from 'react'

const Record = ({ onClick, data}) => (
    <li
      onClick={onClick}
    //   style={ {
    //     textDecoration: completed ? 'line-through' : 'none'
    //   }}
    >
      {JSON.stringify(data)}
    </li>
)

export default Record