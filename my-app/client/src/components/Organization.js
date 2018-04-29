import React from 'react'
import logo from '../logo.svg';

const Organization = ({ onClick, data, index }) => {
    if (data.hasOwnProperty('org'))
        return (
            <div key={index} onClick={onClick} className="col-xs-2 col-sm-2 placeholder" style={{ 'marginBottom': '10px' }} >
                <img src={logo} className="img-responsive" alt="Generic placeholder thumbnail" />
                <h4 className="text-center">{data["org"]}</h4>
            </div>
        )
    else return null;
}

export default Organization

