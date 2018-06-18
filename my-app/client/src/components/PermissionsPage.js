import React from 'react'
import logo from '../logo.svg';
import { BeatLoader } from 'react-spinners';
import PermissionsList from './PermissionsList'
import Nav from './nav'

class PermissionsPage extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.actions.onInitIds(31).then(() =>{
            console.log("props",this.props.ids)
            this.props.actions.onInitPermissions(this.props.ids);

            // {
            //     "ids": ["6911edd0-7099-11e8-be2a-d7026018c26b",
            //         "fbf2a970-70a1-11e8-b2d4-017780bd510b"]
            // }
        });
    }

    render() {
        console.log(this.props)
        console.log(this.props.actions)
        
        if (this.props.allPermissions.length > 0) {
            return (
                <div>
                    <Nav />
                    <div style={{ 'marginTop': '60px' }}>
                        {this.props.allPermissions.map((permissions, index) => (
                            <PermissionsList key={index} index={index} permissions={permissions} />
                        ))}
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