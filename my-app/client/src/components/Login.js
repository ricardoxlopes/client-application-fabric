import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { BeatLoader } from 'react-spinners';

const Login = ({ onSubmit }) => {
    var email = "";
    var password = "";

    return (
        <div>
            <MuiThemeProvider>
                <div>
                    <AppBar
                        title="Login"
                    />
                    <TextField
                        hintText="Enter your email"
                        floatingLabelText="Email"
                        onChange = {(event,newValue) => {email=newValue}}
                    />
                    <br />
                    <TextField
                        type="password"
                        hintText="Enter your Password"
                        floatingLabelText="Password"
                        onChange = {(event,newValue) => {password=newValue}}
                    />
                    <br />
                    <RaisedButton label="Submit" style={{'margin': 15}} primary={true} onClick={() => onSubmit(email, password)} />
                </div>
            </MuiThemeProvider>
        </div>)
}

export default Login;