import React from 'react'
import { SplitButton, MenuItem } from 'react-bootstrap';

const Record = ({ onClick, record, index }) => {

    return (<tr key={index}>
        <td style={{ 'verticalAlign': 'middle' }} >{index + 1}</td>
        <td style={{ 'verticalAlign': 'middle' }} >{JSON.stringify(record)}</td>
        <td style={{ 'verticalAlign': 'middle' }} >{index + 1}</td>
    </tr>
    )
}

export default Record

