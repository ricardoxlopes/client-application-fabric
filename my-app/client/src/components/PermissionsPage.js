import React from 'react'
import { BeatLoader } from 'react-spinners';
import PermissionsList from './PermissionsList'
import Nav from './nav'

function displayList(orgs) {
    return function (permissions, index) {
        console.log("perrmission",permissions,index)
        return (<div>
            <h1>Org {orgs[index]} </h1>
            <PermissionsList key={index} index={index} permissions={permissions} />
        </div>)
    };
}

class PermissionsPage extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.actions.onInitIds(31)

        // {
        //     "ids": ["6911edd0-7099-11e8-be2a-d7026018c26b",
        //         "fbf2a970-70a1-11e8-b2d4-017780bd510b"]
        // }
        // });
    }

render() {
    if (this.props.allPermissions.length > 0) {
        console.log("ORGWS",this.props.orgs)
        return (
            <div>
                <Nav></Nav>
                <div style={{ 'marginTop': '60px' }}>
                    {this.props.allPermissions.map(displayList(this.props.orgs))}
                </div>
            </div>
        )
    }
    else return (
        <BeatLoader
            color={'#123abc'}
            loading={this.props.allPermissions.isFetching}
        />
    )
}
}

export default PermissionsPage