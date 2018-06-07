import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

const Register = ({ onSubmit }) => {
    var firstName="";
    var lastName="";
    var email="";
    var password="";

    return (
        <div>
            <MuiThemeProvider>
                <div>
                    <AppBar
                        title="Register"
                    />
                    <TextField
                        hintText="Enter your First Name"
                        floatingLabelText="First Name"
                        onChange={(event, newValue) => {firstName=newValue}}
                    />
                    <br />
                    <TextField
                        hintText="Enter your Last Name"
                        floatingLabelText="Last Name"
                        onChange={(event, newValue) => {lastName=newValue}}
                    />
                    <br />
                    <TextField
                        hintText="Enter your Email"
                        type="email"
                        floatingLabelText="Email"
                        onChange={(event, newValue) => {email=newValue}}
                    />
                    <br />
                    <TextField
                        type="password"
                        hintText="Enter your Password"
                        floatingLabelText="Password"
                        onChange={(event, newValue) => {password=newValue}}
                    />
                    <br />
                    <RaisedButton label="Submit"  style={{'margin': 15}}  primary={true}  style={{'margin': 15}} onClick={() => onSubmit(firstName,lastName,email,password)} />
                </div>
            </MuiThemeProvider>
        </div>)
}

export default Register;
