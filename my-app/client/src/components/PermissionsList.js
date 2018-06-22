import React from 'react'
import Permission from './Permission'
import { BeatLoader } from 'react-spinners';

const PermissionsList = ({ permissions, org, onPermissionClick }) => {
    console.log(permissions.length)
    if (permissions.length > 0){

    return (
            <table className="table table-striped table-hover">
                <thead className="thead-dark">
                    <tr>
                        <th>#</th>
                        <th>Organization</th>
                        <th>State</th>
                    </tr>
                </thead>
                <tbody>
                    {permissions.map((permission, index) => (
                        <Permission key={index} onClick={onPermissionClick} index={index} permission={permission} />
                    ))}
                </tbody>
            </table>
        )
    }else return (<h1> No permissions </h1>)

}

export default PermissionsList