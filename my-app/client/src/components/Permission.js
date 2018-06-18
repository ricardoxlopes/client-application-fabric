import React from 'react'
import { SplitButton, MenuItem } from 'react-bootstrap';

const Permission = ({ onClick, permission, index }) => {
    return (<tr key={index}>
        <td style={{ 'verticalAlign': 'middle' }} >{index + 1}</td>
        <td style={{ 'verticalAlign': 'middle' }} >{permission.access}</td>
        <td style={{ 'verticalAlign': 'middle' }} >{JSON.stringify(permission.permission)}</td>
    </tr>
    )
}

export default Permission

