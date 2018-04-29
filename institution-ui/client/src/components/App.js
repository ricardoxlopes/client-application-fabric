import React, { Component } from 'react';
// import './App.css';
import { connect } from 'react-redux'
import RecordsList from '../containers/RecordsList'
import PatientsList from '../containers/PatientsList'
import { fetchPatients, fetchRecords } from '../actions/index'

let requestInitialData = function (dispatch) {
  let onInit = function () {
    dispatch(fetchPatients())
  };
  return {
    onInit
  };
}

class App extends Component  {
  constructor(props) {
    super(props);
    this.handler = requestInitialData(this.props.dispatch);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: false
    };
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  render() {
    return (
      <div className="App">
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
          <h2 className="sub-header"> Patients </h2>
          <PatientsList state={this.state} handleShow={this.handleShow} handleClose={this.handleClose}/>
          <h2 className="sub-header"> Records </h2>
          <RecordsList />
        </div>
      </div>
      )
  }

  componentDidMount() {
    this.handler.onInit()
  }
}

export default connect()(App);