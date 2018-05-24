'use strict';
var mysql = require('mysql');
var fs = require('fs');
const uuidv1 = require('uuid/v1')
var token = require('token');
var bcrypt = require('bcrypt');

module.exports = function (Gchainid) {
  var con = mysql.createConnection("mysql://b09d80e3b40bed:0c7bf03e@eu-cdbr-west-02.cleardb.net/heroku_b8116f21146b486?reconnect=true");
  //token expiring time
  token.defaults.timeStep = 24 * 60 * 60; // 24h in seconds
  token.defaults.cache = false

  function verifyPatientExistence(patientId) {
    var sql = "SELECT EXISTS(SELECT 1 FROM patient WHERE patient_id=?)"
    return con.query(sql,[patientId], function (err, result) {
      if (err) throw err;
      if (result == 0)
        return false;
      else {
        console.log("Patient " + patientId + " exists");
        return true;
      }
    });
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
    let values={patient_id: patientId,organization_id: organizationId,patient_organization_id: patientOrgId}
    let sql = "INSERT INTO patient_organization SET ?"
    con.query(sql,values, function (err, results,fields) {
      if (err) throw err;
      console.log("Patient " + patientId + " organization " + organizationId + " association registered");
      return true;
    });
  }

  Gchainid.registerPatient = function (name, email, password, cb) {
    encrytPassword(password).then(function (password) {
      let patientId = generateUUID();
      let values={patient_id:patientId,name: name,email: email,password: password}
      let sql = "INSERT INTO patient SET ?"
      con.query(sql, values, function (err, result) {
        if (err) throw err;
        console.log("Patient registered");
      });
    });

    cb(null,{ "info": "Patient registered" })
  }

  Gchainid.registerOrg = function (name,password,cb) {
    let encrytedPassword = encrytPassword(password).then(function (password) {
      let values={name: name,password: password}
      let sql = "INSERT INTO organization SET ?"
      con.query(sql,values, function (err, result) {
        if (err) throw err;
        console.log("Organization registered");
      });
    });

    cb(null,{ "info": "Organization registered" })
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
          cb(null,{ "info": "Patient registered successfully" })
        else cb(null,{ "error": "Could not register patient/org association" })
      } else cb(null,{ "error": "Invalid patient Id" })
    } else {
      cb(null, { "error": state + " certificate." })
    }
  }

  Gchainid.remoteMethod('getTrustableOrgToken', {
    http: {
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
      path: '/registerPatient',
      verb: 'post'
    },
    accepts: [
      {
        arg: 'name',
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
};
