import React from 'react'
import Permission from './Permission'
import { BeatLoader } from 'react-spinners';

const PermissionsList = ({ permissions, onPermissionClick }) => {
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
                    {permissions["permissions"].map((permission, index) => (
                        <Permission key={index} onClick={onPermissionClick} index={index} permission={permission} />
                    ))}
                </tbody>
            </table>
        )
}

export default PermissionsList