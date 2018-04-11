import React, { Component } from 'react';
import logo from './logo.svg';
import { Navbar, Jumbotron, Button } from 'react-bootstrap';
//import './App.css';

class App extends Component {
  state ='';

  componentDidMount() {
    this.callApi()
      .then(res => this.setState(res))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/api/BlockchainClis/status');

    var body = await response.json();

    if (response.status !== 200) throw Error(body.message);
    
    return body.status;
  };

  render() {
    return (
      <div>
        <nav class="navbar navbar-inverse navbar-fixed-top">
            <div class="navbar-header">
              <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
              </button>
              <a class="navbar-brand" href="#">GlinttChain</a>
            </div>
            <div id="navbar" class="navbar-collapse collapse"  style={{'margin-right': '10px'}}>
              <ul class="nav navbar-nav navbar-right">
                <li><a href="#">Dashboard</a></li>
                <li><a href="#">Settings</a></li>
                <li><a href="#">Help</a></li>
              </ul>
              <form class="navbar-form navbar-right">
                <input type="text" class="form-control" placeholder="Search..."/>
              </form>
            </div>
        </nav>
      
      <div class="container-fluid" style={{'margin-top': '50px'}}>
      <div class="row">
        <div class="col-sm-12 col-md-12 ">
          <h1 class="page-header">Dashboard</h1>
          {<div className="App-intro">
            <Organizations orgs={this.state} />
          </div>}
          <h2 class="sub-header"> Health Records </h2>
          <div class="table-responsive">
          {<div className="App-intro">
            <HealthRecords orgs={this.state} />
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
  }
  render() {
    return (
      <div class="row placeholders">
          { this.props && this.props.orgs &&
            Object.entries(this.props.orgs['orgs']).map((index,value) => {
              var org=this.props.orgs['orgs']
              var indexi=index+1
              console.log(index,index[1][value+1])
              return (
              <div class="col-xs-6 col-sm-3 placeholder">
                <img src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" width="200" height="200" class="img-responsive" alt="Generic placeholder thumbnail"/>
                <h4>{index[1][value+1]}</h4>
                <span class="text-muted">Description</span>
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
      <table class="table table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Header1</th>
                    <th>Header2</th>
                    <th>Header3</th>
                    <th>Header4</th>
                  </tr>
                </thead>
                <tbody>
          { this.props && this.props.orgs &&
            Object.entries(this.props.orgs['orgs']).map((index,value) => {
              var org=this.props.orgs['orgs']
              var indexi=index+1
              console.log(index,index[1][value+1])
              return (
                  <tr>
                    <td>{indexi[0]}</td>
                    <td>{index[1][value+1]}Info</td>
                    <td>{index[1][value+1]}Info</td>
                    <td>{index[1][value+1]}Info</td>
                    <td>{index[1][value+1]}Info</td>
                  </tr>
            )})
          }
          </tbody>
      </table>
     );
   }
 };
export default App;
