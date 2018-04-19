import React from 'react';
import logo from './logo.svg';
import { SplitButton, MenuItem } from 'react-bootstrap';
//Navbar, Jumbotron, Button,
// import update from 'react-addons-update';
import update from 'immutability-helper';
//import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props)
    //TODO hardcoded
    this.state = { orgs: '', channels: '', records: '', selected: 'mychannel4' };
    this.handler = this.handlers.bind(this)
  }

  handlers(newRecords, channel) {
    this.setState({
      records: update(this.state.records, { $set: JSON.parse(newRecords) }),
      selected: update(this.state.selected, { $set: channel })
    })
  }

  componentDidMount() {

    this.initialization()
      .then(res => this.setState({
        orgs: update(this.state.orgs, { $set: JSON.parse(res)["orgs"] }),
        channels: update(this.state.channels, { $set: JSON.parse(res)["channels"] }),
        records: update(this.state.records, { $set: JSON.parse(res)["records"] }),
        //TODO SELECTED
      }))
      .catch(err => console.log(err));
  }

  initialization = async () => {
    const response = await fetch('/api/BlockchainClis/init');
    var body = await response.json()
    if (response.status !== 200) throw Error(body.message);
    return body.info;
  };

  render() {
    return (
      <div>
        <nav className="navbar navbar-inverse navbar-fixed-top">
          <div className="navbar-header">
            <h3 style={{ 'marginLeft': '20px', 'color': 'white' }}>
              <b>
                <i> gChain </i>
              </b>
            </h3>
          </div>
        </nav>
        <div className="container-fluid" style={{ 'marginTop': '50px' }}>
          <div className="row col-sm-12 col-md-12" style={{ 'marginTop': '10px' }} >
            <div className="col-sm-3 col-md-3">
              {
                <Wallet orgs={this.state.orgs} channels={this.state.channels} handler={this.handler} />
              }
            </div>
            <div className="col-sm-9 col-md-9">
              {
                <Organizations orgs={this.state.orgs} channels={this.state.channels} handler={this.handler} />
              }
            </div>
          </div>
          <div className="row col-sm-12 col-md-12" style={{ 'marginLeft': '10px' }}>
            <h2 className="sub-header"> Health Records </h2>
            {
              <HealthRecords records={this.state.records} orgs={this.state.orgs} selected={this.state.selected} channels={this.state.channels} handler={this.handler} />
            }
          </div>
        </div>
      </div>
    );
  }
}
// TODO não há necessidade de receber todas as instituições
class Wallet extends React.Component {
  constructor(props) {
    super(props);
  }

  getOrgRecords = async (channel) => {
    const response = await fetch(
      '/api/BlockchainClis/records',
      {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ channel: channel })
      });

    var body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body.records;
  };

  handleClick = (channel) => {
    this.getOrgRecords(channel)
      .then(res => this.props.handler(res, channel))
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="col-sm-12 col-md-12" style={{ 'background': 'rgb(230,230,230)' }}>
        <h1 className="text-center"> Private wallet </h1>
        {this.props && this.props.orgs &&
          Object.entries(this.props.orgs).map((value, index) => {
            if (JSON.parse(value[1]).hasOwnProperty('name')) {
              // console.log(index, value[1])
              return (
                <div key={index} onClick={() => this.handleClick(this.props.channels[index])}>
                  <img src={logo} className="img-responsive" alt="Generic placeholder thumbnail" />
                  <h4 className="text-center">{JSON.parse(value[1])["name"]}</h4>
                </div>
              )
            } else return false;
          })
        }
      </div>
    );
  }
};

class Organizations extends React.Component {
  constructor(props) {
    super(props);
  }

  getOrgRecords = async (channel) => {
    const response = await fetch(
      '/api/BlockchainClis/records',
      {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ channel: channel })
      });

    var body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body.records;
  };

  handleClick = (channel) => {
    this.getOrgRecords(channel)
      .then(res => this.props.handler(res, channel))
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="col-sm-12 col-md-12">
        <h1 style={{ 'marginLeft': '20px' }}> Organizations </h1>
        {this.props && this.props.orgs &&
          Object.entries(this.props.orgs).map((value, index) => {
            var name = JSON.parse(value[1])
            if (name.hasOwnProperty('org')) {
              name = name["org"]
              return (
                <div key={index} className="col-xs-2 col-sm-2 placeholder" style={{ 'marginBottom': '10px' }} onClick={() => this.handleClick(this.props.channels[index])}>
                  <img src={logo} className="img-responsive" alt="Generic placeholder thumbnail" />
                  <h4 className="text-center">{name}</h4>
                </div>
              )
            }
          })
        }
      </div>
    );
  }
};

class HealthRecords extends React.Component {
  constructor(props) {
    super(props);
    this.currentRecord=''
  }

  invoke = async (channel, record) => {
    const response = await fetch(
      '/api/BlockchainClis/invoke',
      {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ channel: channel, record: record })
      });

    var body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body.res;
  };

  handleClick = (channel, record) => {
    console.log("handlerClickARGS: ",channel,record)
    this.invoke(channel, record)
      .then(res => console.log(res))
      .catch(err => console.log(err));
  }

  render() {
    return (
      <table className="table table-striped table-hover">
        <thead className="thead-dark">
          <tr>
            <th>#</th>
            <th>Record</th>
            <th>Source</th>
            <th>Sharing</th>
          </tr>
        </thead>
        <tbody>
          {this.props && this.props.records &&
            Object.entries(JSON.parse(this.props.records)).map((value, index) => {
              // console.log(this.props.records)
              // console.log(value[1], index)
              this.currentRecord=JSON.stringify(value[1])
              return (
                <tr key={index}>
                  <td style={{ 'verticalAlign': 'middle' }} >{index + 1}</td>
                  <td style={{ 'verticalAlign': 'middle' }} >{JSON.stringify(value[1])}</td>
                  <td style={{ 'verticalAlign': 'middle' }} >{index + 1}</td>
                  <td style={{ 'verticalAlign': 'middle' }} >
                    <SplitButton
                      bsStyle="default"
                      title="Share with"
                      key={index}
                      id={`split-button-basic-${index}`}
                      pullRight
                      dropup
                    >
                      {this.props && this.props.orgs &&
                        Object.entries(this.props.orgs).map((value, index) => {
                          // console.log(this.props.orgs)
                          // console.log(value[1], index)
                          // var channel=this.props[this.props.orgs.indexOf(JSON.parse(value[1])["org"])];
                          if (this.props.selected !== this.props.channels[index]) {
                            var name = JSON.parse(value[1])
                            if (name.hasOwnProperty('org')) {
                              name = name["org"]
                            } else {
                              name = name["name"]
                            }

                            return (
                              <MenuItem key={index} onSelect={() => this.handleClick(this.props.channels[index],this.currentRecord)}>{name}</MenuItem>
                            )
                          } return false;
                        })
                      }
                    </SplitButton>
                  </td>
                </tr>
              )
            })}
        </tbody>
      </table>
    );
  }
};
export default App;
