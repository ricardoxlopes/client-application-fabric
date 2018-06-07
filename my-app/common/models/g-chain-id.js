'use strict';
var mysql = require('promise-mysql');
var fs = require('fs');
const uuidv1 = require('uuid/v1')
var token = require('token');
var bcrypt = require('bcrypt');
var rp = require('request-promise');

//TODO handle exceptions

module.exports = function (Gchainid) {
  var pool = mysql.createPool("mysql://b09d80e3b40bed:0c7bf03e@eu-cdbr-west-02.cleardb.net/heroku_b8116f21146b486?reconnect=true")

  //token expiring time
  token.defaults.timeStep = 24 * 60 * 60; // 24h in seconds
  token.defaults.cache = false

  async function verifyPatientExistence(patientEmail, patientPassword) {
    let sql = "SELECT password from patient WHERE email=?"
    let result = await pool.query(sql, [patientEmail]);
    if (result.length == 0)
      return false;
    let encryted = result[0].password;
    return bcrypt.compareSync(patientPassword, encryted.toString());
  }

  function encrytPassword(password) {
    let saltRounds = 10;

    return bcrypt.hash(password, saltRounds);
  }
  function generateUUID() {
    return uuidv1();
  }
  function verifyToken(tokenToVerify, patientId, orgName, role) {
    token.defaults.secret = orgName;
    let state = token.verify(patientId + '|' + 'admin', tokenToVerify);

    switch (state) {
      case 1:
        return { "state": "VALID" }
        break;
      case 2:
        return { "state": "EXPIRING" }
        break;
      default:
        return { "state": "INVALID" }
        break;
    }
  }
  function createPatientOrgAssotiation(patientId, organizationId, patientOrgId) {
    let values = { patient_id: patientId, organization_id: organizationId, patient_organization_id: patientOrgId }
    let sql = "INSERT INTO patient_organization SET ?"
    return pool.query(sql, values, function (err, results, fields) {
      if (err) throw err;
      console.log("Patient " + patientId + " organization " + organizationId + " association registered");
      return true;
    });
  }

  Gchainid.registerPatient = function (firstName,lastName, email, password, cb) {
    encrytPassword(password).then(function (password) {
      let patientId = generateUUID();
      let values = { patient_id: patientId, firstName: firstName,lastName: lastName, email: email, password: password }
      let sql = "INSERT INTO patient SET ?"
      pool.query(sql, values, function (err, result) {
        if (err) throw err;
        console.log("Patient registered");
      });
    });

    cb(null, { "info": "Patient registered" })
  }

  Gchainid.registerOrg = function (name, password, cb) {
    let encrytedPassword = encrytPassword(password).then(function (password) {
      let values = { name: name, password: password }
      let sql = "INSERT INTO organization SET ?"
      pool.query(sql, values, function (err, result) {
        if (err) throw err;
        console.log("Organization registered");
      });
    });

    cb(null, { "info": "Organization registered" })
  }

  Gchainid.getTrustableOrgToken = function (patientId, orgName, cb) {
    verifyPatientExistence(patientId);
    token.defaults.secret = orgName;
    let newToken = token.generate(patientId + '|' + 'admin');
    cb(null, newToken)
  }

  Gchainid.registerAssociationPatientOrg = function (tokenToVerify, patientId, orgId, orgRole, orgName, cb) {
    //verify if token is valid
    var state = verifyToken(tokenToVerify, patientId, orgName, orgRole);
    if (state["state"] == "VALID") {
      //verify if patient exists
      if (verifyPatientExistence(patientId)) {
        //generate private UUID
        let newUUID = generateUUID();
        //register association patient/org
        if (createPatientOrgAssotiation(patientId, orgId, newUUID))
          cb(null, { "info": "Patient registered successfully" })
        else cb(null, { "error": "Could not register patient/org association" })
      } else cb(null, { "error": "Invalid patient Id" })
    } else {
      cb(null, { "error": state + " certificate." })
    }
  }

  Gchainid.loginPatient = function (email, password, cb) {
    verifyPatientExistence(email, password).then(exists => {
      if (exists) {
        var options = {
          method: 'POST',
          uri: 'http://localhost:3001/oauth/token',
          body: {
            email: email,
            password: password
          },
          json: true // Automatically stringifies the body to JSON
        };
        rp(options).then(token => {
          console.log(token)
          cb(null, { token: token });
        }).catch(err => {
          cb({ error: "Unable to login" }, null);
        });
      } else {
        var error = new Error("Unable to login")
        cb(error);
      }
    }).catch(err => {
      console.log(err);
      cb({ error: "Invalid login." }, null);
    });
  }

  Gchainid.remoteMethod('getTrustableOrgToken', {
    http: {
      errorStatus: 400,
      status: 200,
      path: '/getTrustableOrgToken',
      verb: 'get'
    },
    accepts: [
      {
        arg: 'patientId',
        required: true,
        type: 'string'
      },
      {
        arg: 'orgName',
        required: true,
        type: 'string'
      }
    ],
    returns: {
      arg: 'token',
      type: 'string',
    }
  });

  Gchainid.remoteMethod('registerAssociationPatientOrg', {
    http: {
      errorStatus: 400,
      status: 200,
      path: '/registerAssociationPatientOrg',
      verb: 'post'
    },
    accepts: [
      {
        arg: 'tokenToVerify',
        required: true,
        type: 'string'
      },
      {
        arg: 'patientId',
        required: true,
        type: 'string'
      },
      {
        arg: 'orgId',
        required: true,
        type: 'string'
      },
      {
        arg: 'orgRole',
        required: true,
        type: 'string'
      },
      {
        arg: 'orgName',
        required: true,
        type: 'string'
      }
    ],
    returns: {
      arg: 'res',
      type: 'Object',
    }
  });

  Gchainid.remoteMethod('registerOrg', {
    http: {
      errorStatus: 400,
      status: 200,
      path: '/registerOrg',
      verb: 'post'
    },
    accepts: [
      {
        arg: 'name',
        required: true,
        type: 'string'
      },
      {
        arg: 'password',
        required: true,
        type: 'string'
      }
    ],
    returns: {
      arg: 'res',
      type: 'Object',
    }
  });

  Gchainid.remoteMethod('registerPatient', {
    http: {
      errorStatus: 400,
      status: 200,
      path: '/registerPatient',
      verb: 'post'
    },
    accepts: [
      {
        arg: 'firstName',
        required: true,
        type: 'string'
      },
      {
        arg: 'lastName',
        required: true,
        type: 'string'
      },
      {
        arg: 'email',
        required: true,
        type: 'string'
      },
      {
        arg: 'password',
        required: true,
        type: 'string'
      }
    ],
    returns: {
      arg: 'res',
      type: 'Object',
    }
  });

  Gchainid.remoteMethod('loginPatient', {
    http: {
      errorStatus: 400,
      status: 200,
      path: '/loginPatient',
      verb: 'post'
    },
    accepts: [
      {
        arg: 'email',
        required: true,
        type: 'string'
      },
      {
        arg: 'password',
        required: true,
        type: 'string'
      }
    ],
    returns: {
      arg: 'res',
      type: 'Object',
    }
  });
};
