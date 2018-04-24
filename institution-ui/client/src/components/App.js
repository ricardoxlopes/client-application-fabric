import React, { Component } from 'react';
// import './App.css';
import { connect } from 'react-redux'
import RecordsList from '../containers/RecordsList'
import PatientsList from '../containers/PatientsList'
import { fetchPatients,fetchRecords } from '../actions/index'

let requestInitialData = function(dispatch) {
   let onInit = function() {
    dispatch(fetchPatients())
   };
  return {
    onInit
  };
}

class App extends Component {
  constructor(props) {
    super(props);
    this.handler = requestInitialData(this.props.dispatch);
  }

  render() {
    return (<div className="App">
    <header className="App-header">
      <h1 className="App-title">Welcome to React</h1>
    </header>
    <PatientsList/>
    <RecordsList/>
  </div>)
  }

  componentDidMount(){
    this.handler.onInit()
  }
}

export default connect()(App);