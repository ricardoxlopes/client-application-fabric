'use strict';


var Fabric_Client = require('fabric-client');
//var Fabric_CA_Client = require('fabric-ca-client');

var path = require('path');
var util = require('util');
var os = require('os');

//
var fabric_client = new Fabric_Client();
var fabric_ca_client = null;
var admin_user = null;
var member_user = null;
var store_path = path.join(__dirname, 'hfc-key-store');
console.log(' Store path:'+store_path);


var user=fabric_client.createUser(
   {username: 'user1',
   mspid: 'Org1MSP',
   cryptoContent: { privateKeyPEM: '../7f18f52ebbcda764d391cf93953365a33a2aa1469939636f953b9dbe41be75f5_sk', signedCertPEM: "../tlsca.org1.example.com-cert.pem" }
   });

member_user = user;

return fabric_client.setUserContext(member_user);