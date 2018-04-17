import React, { Component } from 'react';
import logo from './logo.svg';
import { Navbar, Jumbotron, Button } from 'react-bootstrap';
// import update from 'react-addons-update';
import update from 'immutability-helper';
//import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {orgs: '',channels: '', records: ''};
    this.handler = this.handlers.bind(this)
  }
 
  //TODO rever a inicialização json, e fazer o que esta para o records para o orgs
  //json.parse() do orgs
  
  handlers(newRecords) {
    console.log("ENTERERERER")
    this.setState({
      records: update(this.state.records,{$set: JSON.parse(newRecords)})
    })
  }

  componentDidMount() {
 
    this.initialization()
      .then(res => this.setState({
          orgs: update(this.state.orgs,{$set: JSON.parse(res)["orgs"] }),
          channels: update(this.state.channels,{$set: JSON.parse(res)["channels"] }),
          records: update(this.state.records,{$set: JSON.parse(res)["records"] })
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
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <a className="navbar-brand" href="#">gChain</a>
            </div>
            {/* <div id="navbar" class="navbar-collapse collapse"  style={{'margin-right': '10px'}}>
              <ul class="nav navbar-nav navbar-right">
                <li><a href="#">Dashboard</a></li>
                <li><a href="#">Settings</a></li>
                <li><a href="#">Help</a></li>
              </ul>
              <form class="navbar-form navbar-right">
                <input type="text" class="form-control" placeholder="Search..."/>
              </form>
            </div> */}
        </nav>
      
      <div className="container-fluid" style={{'marginTop': '50px'}}>
      <div className="row">
        <div className="col-sm-12 col-md-12 ">
          <h1 className="page-header">Organizations</h1>
          {<div className="App-intro">
            <Organizations orgs={this.state.orgs} channels={this.state.channels} handler={this.handler} />
          </div>}
          <h2 className="sub-header"> Health Records </h2>
          <div className="table-responsive">
          {<div className="App-intro">
            <HealthRecords records={this.state.records} />
          </div>}
          </div>
        </div>
      </div>
      </div>
    </div>
    );
  }
}

class Organizations extends React.Component {
  constructor(props) {
    super(props);
    // this.name="default"
  }

  getOrgRecords = async (org) => {
    const response = await fetch(
    '/api/BlockchainClis/records',
    { method: 'post', 
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({org: org})});

    var body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body.records;
  };

  handleClick = (org) => {
    this.getOrgRecords(org)
      .then(res => this.props.handler(res))
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="row placeholders">
          { this.props && this.props.orgs &&
            Object.entries(this.props.orgs).map((value,index) => {
              var name=""

              if (JSON.parse(value[1]).hasOwnProperty('org')){
                name=JSON.parse(value[1])["org"]
              }else{
                name=JSON.parse(value[1])["name"]
              }

              console.log(index,value[1])
              return (
              <div key={index} className="col-xs-6 col-sm-3 placeholder" style={{'marginBottom': '10px'}} onClick={() => this.handleClick(this.props.channels[index])}>
                <img src={logo} width="150" height="150" className="img-responsive" alt="Generic placeholder thumbnail"/>
                <h4>{name}</h4>
              </div>
            )})
          }
      </div>
     );
   }
 };

 class HealthRecords extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Record</th>
            <th>Origin</th>
          </tr>
        </thead>
        <tbody>
          { this.props && this.props.records &&
            Object.entries(JSON.parse(this.props.records)).map((value,index) => {
              console.log(this.props.records)
              console.log(value[1],index)//,index[1][value+1])
              return (
                  <tr key={index}>
                    <td>{index+1}</td>
                    <td>{JSON.stringify(value[1])}</td>
                    <td>FROM</td>
                  </tr>
            )})
          }
        </tbody>
      </table>
     );
   }
 };
export default App;
