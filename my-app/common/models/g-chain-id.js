'use strict';
var mysql = require('mysql');
var fs = require('fs');
const uuidv1 = require('uuid/v1')
var token = require('token');

module.exports = function(Gchainid) {
    var con = mysql.createConnection("mysql://b09d80e3b40bed:0c7bf03e@eu-cdbr-west-02.cleardb.net/heroku_b8116f21146b486?reconnect=true");
      
    //initialization
    connectDB()

    //connect to db
    function connectDB(){
      con.connect(function(err) {
      if (err) throw err;
          console.log("Connected!");
      });
    }
    function verifyPatientExistence(patientId){
      var sql="SELECT EXISTS(SELECT 1 FROM patient WHERE id="+patientId+")"
      con.query(sql, function (err, result) {
        if (err) throw err;
        if (result == 0)
          return false;
        else{
          console.log("Patient "+patientId+" exists");
          return true;
        }
      });
    }
    function generateUUID(){
      return uuidv1();
    }
    function verifyToken(tokenToVerify,patientId,role){
      let state=token.verify(patientId+'|'+role,tokenToVerify);

      switch (state) {
        case 1:
          return JSON.stringify({"state":"VALID"})
          break;
        case 2:
          return JSON.stringify({"state":"EXPIRING"})
          break;
        default:
          return JSON.stringify({"state":"INVALID"})
          break;
      }
    }
    function createPatientOrgAssotiation(patientId,organizationId,patientOrgId){
      var sql="INSERT INTO patient_organization ('patient_id,organization_id,patient_organization_id') VALUES ("+patientId+","+organizationId+","+patientOrgId+")";
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Patient "+patient_id+" organization "+organizationId+" association registered");
        return true;
      });
    }
    
    Gchainid.registerPatient = function(patientObject,cb){
      let patientId=generateUUID();

      var sql = "INSERT INTO patient ('patient_id,name,email,password') VALUES ("+patientId+","+patientObject.name+","+patientObject.email+","+patientObject.password+")";
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Patient "+patientId+" registered");
      });
      cb(null,JSON.stringify({"info":"Patient "+patientId+" registered"}))
    }

    Gchainid.registerOrg = function(orgObject,cb){
      let orgId=generateUUID();

      var sql = "INSERT INTO organization ('name') VALUES ("+orgObject.name+")";
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Organization "+orgId+" registered");
      });
      cb(null,JSON.stringify({"info":"Organization "+orgId+" registered"}))
    }

    Gchainid.addTrustableOrg = function(patientId,cb){
      //token uses patientId and role admin
      token.defaults.secret = patientId;
      token.defaults.timeStep = 24 * 60 * 60; // 24h in seconds
      let newToken=token.generate(patientId+'|admin')
      // secretJson=JSON.stringify( { id: patientId, role: 'admin', auth: newToken });
      cb(null,newToken)
    }
    
    Gchainid.registerAssociationPatientOrg = function(tokenToVerify,orgRole,patientId,organizationId,cb){
      //verify if token is valid
      var state=this.verifyToken(tokenToVerify,patientId,orgRole);
      if (JSON.parse(state)["state"] == "VALID"){
        //verify if patient exists
        if (this.verifyPatientExistence(patientId)){
          //generate private UUID
          let newUUID=this.generateUUID()
          //register association patient/org
          if (this.createPatientOrgAssotiation(patientId,organizationId,newUUID))
            cb(null,JSON.stringify({"info":"Patient registered successfully"}))
          else cb(null,JSON.stringify({"error":"Could not register patient/org association"}))
        }else cb(null,JSON.stringify({"error":"Invalid patient Id"}))
      }else{
        cb(null,JSON.stringify({"error":state+" certificate."}))
      }
    }

    Gchainid.remoteMethod('addTrustableOrg', {
      http: {
        path: '/addTrustableOrg',
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
        path: '/registerAssociationPatientOrg',
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
        arg: 'res',
        type: 'string',
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
        }
      ],
      returns: {
        arg: 'res',
        type: 'string',
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
        type: 'string',
      }
    });
};
