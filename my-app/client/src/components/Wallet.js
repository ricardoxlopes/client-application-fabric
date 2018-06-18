import React from 'react'
import logo from '../logo.svg';
import { BeatLoader } from 'react-spinners';
import RecordsList from './RecordsList'
import RaisedButton from 'material-ui/RaisedButton';
import Nav from './nav'

class Wallet extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.actions.onInit("e8758a20-6354-11e8-ba8c-d103e9e0bfef");
    }

    render() {
        // console.log(this.props.wallet.records.length > 0)
        if (this.props.wallet.records.length > 0) {
            return (
                <div>
                    <Nav />
                    {/* <RaisedButton label="Manage permissions" style={{ 'margin': 15 }} primary={true} onClick={() => this.props.actions.onSubmit(email, password)} /> */}
                    <div className="row col-sm-12 col-md-12" style={{ 'marginLeft': '10px','marginTop': '50px' }}>
                        <h2 className="sub-header"> Health Records </h2>
                        <RecordsList records={this.props.wallet.records} />
                    </div>
                </div>
            );
        }
        else return (
            <BeatLoader
                color={'#123abc'}
                loading={this.props.wallet.isFetching}
            />
        );
    }
}

export default Wallet