'use strict';
var mysql = require('promise-mysql');
var fs = require('fs');
const uuidv1 = require('uuid/v1')
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var rp = require('request-promise');
// var gChainRecords = require('g-chain-records');
//TODO handle exceptions
var secret = '34124A08F5AFE1A2BC612FB58F756158EB9290906FD688CD85476F69B2FC292C'

module.exports = function (Gchainid) {
  var pool = mysql.createPool("mysql://b09d80e3b40bed:0c7bf03e@eu-cdbr-west-02.cleardb.net/heroku_b8116f21146b486?reconnect=true")

  async function createPatientTokenAssotiation(patientId, token) {

    let values = { patient_id: patientId, token: token }
    let sql = "INSERT INTO token SET ?"
    try {
      await pool.query(sql, values);
    } catch (err) {
      console.log(err)
      return false;
    }
    console.log("Created patient/token association");
    return true;
  }

  async function verifyTokenAssociation(token) {

    let sql = "SELECT patient_id from token WHERE token=?"
    let result = await pool.query(sql, [token]);
    if (result.length == 0)
      return { result: "invalid" };

    return { result: result[0].patient_id };
  }

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
  // function verifyToken(tokenToVerify, patientId, orgName, role) {
  //   token.defaults.secret = orgName;
  //   let state = token.verify(patientId + '|' + 'admin', tokenToVerify);

  //   switch (state) {
  //     case 1:
  //       return { "state": "VALID" }
  //       break;
  //     case 2:
  //       return { "state": "EXPIRING" }
  //       break;
  //     default:
  //       return { "state": "INVALID" }
  //       break;
  //   }
  // }
  function createPatientOrgAssotiation(patientId, organizationId, patientOrgId) {
    let values = { patient_id: patientId, organization_id: organizationId, patient_organization_id: patientOrgId }
    let sql = "INSERT INTO patient_organization SET ?"
    return pool.query(sql, values, function (err, results, fields) {
      if (err) throw err;
      console.log("Patient " + patientId + " organization " + organizationId + " association registered");
      return true;
    });
  }

  async function getPrivateIds(patientId) {
    let sql = "SELECT patient_organization_id from patient_organization WHERE patient_id=?";
    let result = await pool.query(sql, [patientId]);
    if (result.length == 0)
      return { result: "No association for patient" + patientId };
    var ids=[];
    for (let index = 0; index < result.length; index++) {
      ids.push(result[index].patient_organization_id)
    }
    return ids;
  }

  Gchainid.getAllPrivateIds = function (patientId, cb) {
    getPrivateIds(patientId).then(res => {
      console.log(res)
      cb(null, res)
    }).catch(err => {
      cb(err, null)
    });
  }

  Gchainid.registerPatient = function (firstName, lastName, email, password, cb) {
    encrytPassword(password).then(function (password) {
      // let patientId = generateUUID();
      let values = { firstName: firstName, lastName: lastName, email: email, password: password }
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

  Gchainid.getTrustableOrgToken = function (patientId, cb) {
    // CHECK WEBTOKEN
    try {
      var token = jwt.sign({
        data: patientId
      }, secret, { expiresIn: '1h' });
    } catch (err) {
      console.log(err);
      cb(err, null)
    }

    createPatientTokenAssotiation(patientId, token).then(() => {
      cb(null, token);
    }).catch(err => {
      console.log(err);
      cb(err, null);
    })
  }

  Gchainid.registerAssociationPatientOrg = function (tokenToVerify, orgId, cb) {

    try {
      jwt.verify(tokenToVerify, secret);
    } catch (err) {
      console.log("Error: Token invalid", err);
      cb({ result: err.message }, null);
    }

    verifyTokenAssociation(tokenToVerify).then(result => {
      if (result["result"] != "invalid") {
        var patientId = result["result"];
        console.log(result)
        //verify if patient exists
        if (verifyPatientExistence(patientId)) {
          //generate private UUID
          let newUUID = generateUUID();
          //register association patient/org
          if (createPatientOrgAssotiation(patientId, orgId, newUUID))
            cb(null, { "info": "Patient registered successfully" })
          else cb({ "error": "Could not register patient/org association" }, null)
        } else cb({ "error": "Invalid patient Id" }, null)
      } else {
        cb({ "error": "Invalid token" }, null)
      }
    });
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

  Gchainid.remoteMethod('getAllPrivateIds', {
    http: {
      errorStatus: 400,
      status: 200,
      path: '/getAllPrivateIds',
      verb: 'get'
    },
    accepts: [
      {
        arg: 'patientId',
        required: true,
        type: 'string'
      }
    ],
    returns: {
      arg: 'ids',
      type: 'object',
    }
  });

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
        arg: 'orgId',
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
