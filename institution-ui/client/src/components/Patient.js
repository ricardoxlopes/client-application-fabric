import React from 'react'
import { SplitButton, Modal, Button } from 'react-bootstrap';


const Patient = ({ onClick, data, index, state, handleClose,handleShow }) => (

  <tr key={index} onClick={onClick} >
    <td style={{ 'verticalAlign': 'middle' }} >{data}</td>
    <td style={{ 'verticalAlign': 'middle' }} >{data}</td>
    <td style={{ 'verticalAlign': 'middle' }} >{data}</td>
    <td style={{ 'verticalAlign': 'middle' }} >

      <Button bsStyle="primary" bsSize="medium" onClick={handleShow}>
        add new record
      </Button>

      <Modal show={state.show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Record</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Text in a modal</h4>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose}>Transact record</Button>
          <Button onClick={handleClose}>Discard and close</Button>
        </Modal.Footer>
      </Modal>
    </td>
  </tr>
)

export default Patient