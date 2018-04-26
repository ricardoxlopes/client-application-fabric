import React from 'react'
import Patient from './Patient'

const PatientsList = ({ patients, onPatientClick }) => (
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
        <Patient key={index} index={index} data={patient} onClick={patient => onPatientClick(patient)} />
      ))}
    </tbody>
  </table>
)

export default PatientsList