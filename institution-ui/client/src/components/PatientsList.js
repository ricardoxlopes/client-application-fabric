import React from 'react'
import Patient from './Patient'

const PatientsList = ({ patients,onPatientClick,handleShow,handleClose, state}) => (
  <table className="table table-striped table-hover">
    <thead className="thead-dark">
      <tr>
        <th>#</th>
        <th>Name</th>
        <th>info</th>
        <th>info</th>
      </tr>
    </thead>
    <tbody>
      {patients.isFetching && patients.patients.map((patient, index) => (
        <Patient key={index} onClick={() => onPatientClick(patient[0])} state={state} handleShow={handleShow} handleClose={handleClose} index={index} data={patient} />
      ))}
    </tbody>
  </table>
)

export default PatientsList