import React from 'react'
import logo from '../logo.svg';

const Organization = ({ onClick, name, index }) => (
    <div key={index} onClick={onClick} className="col-xs-2 col-sm-2 placeholder" style={{ 'marginBottom': '10px' }} >
        <img src={logo} className="img-responsive" alt="Generic placeholder thumbnail" />
        <h4 className="text-center">{name}</h4>
    </div>
)

export default Organization

