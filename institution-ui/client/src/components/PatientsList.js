import React from 'react'
import Patient from './Patient'

const PatientsList = ({ patients, onPatientClick }) => (
  <ul>
    {patients.isFetching && patients.patients.map((patient, index) => (
      <Patient key={index} data={patient} onClick={() => console.log(index)} />
    ))}
  </ul>
)

export default PatientsList