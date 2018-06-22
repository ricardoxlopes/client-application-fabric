var Fabric_Client = require('fabric-client');
var Fabric_CA_Client = require('fabric-ca-client');

var path = require('path');

// var fabric_client = new Fabric_Client(); //COMMENT TO NEW ORG????TODO
var fabric_ca_client = null;
var admin_user = null;
var member_user = null;

// registerObject={argPath, argCaUrl, argUser, argMspid,argAffiliation,argRole}
function registerUser(registerObject, fabric_client = new Fabric_Client()) {

  return new Promise((resolve, reject) => {

    var store_path = path.join(__dirname, registerObject.argPath);
    // console.log(' Store path:' + store_path);

    // create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
    Fabric_Client.newDefaultKeyValueStore({
      path: store_path,
    }).then(state_store => {
      // assign the store to the fabric client
      fabric_client.setStateStore(state_store);
      var crypto_suite = Fabric_Client.newCryptoSuite();
      // use the same location for the state store (where the users' certificate are kept)
      // and the crypto store (where the users' keys are kept)
      var crypto_store = Fabric_Client.newCryptoKeyStore({ path: store_path });
      crypto_suite.setCryptoKeyStore(crypto_store);
      fabric_client.setCryptoSuite(crypto_suite);
      var tlsOptions = {
        trustedRoots: [],
        verify: false,
      };
      // be sure to change the http to https when the CA is running TLS enabled TODO caname
      fabric_ca_client = new Fabric_CA_Client(registerObject.argCaUrl, null, '', crypto_suite);

      // first check to see if the admin is already enrolled
      return fabric_client.getUserContext('admin', true);
    }).then(user_from_store => {
      if (user_from_store && user_from_store.isEnrolled()) {
        // console.log('Successfully loaded admin from persistence');
        admin_user = user_from_store;
      } else {
        throw new Error('Failed to get admin.... run enrollAdmin.js');
      }

      return fabric_client.getUserContext(registerObject.argUser, true);
    }).then(user_from_store => {
      if (user_from_store && user_from_store.isEnrolled()) {
        // console.log('Successfully loaded '+registerObject.argUser+' from persistence');
        resolve()
      } else {
        // at this point we should have the admin user
        // first need to register the user with the CA server
        return fabric_ca_client.register(
          { enrollmentID: registerObject.argUser, affiliation: registerObject.argAffiliation, role: registerObject.argRole },
          admin_user
        ).then(secret => {
          // next we need to enroll the user with CA server
          // console.log('Successfully registered user - secret:' + secret);

          return fabric_ca_client.enroll({
            enrollmentID: registerObject.argUser,
            enrollmentSecret: secret,
          });
        }).then(enrollment => {
          // console.log('Successfully enrolled member user ', registerObject.argUser);
          return fabric_client.createUser({
            username: registerObject.argUser,
            mspid: registerObject.argMspid,
            cryptoContent: {
              privateKeyPEM: enrollment.key.toBytes(),
              signedCertPEM: enrollment.certificate,
            },
          });
        }).then(user => {
          member_user = user;

          return fabric_client.setUserContext(member_user);
        }).then(() => {
          // console.log(
          //   'User was successfully registered and enrolled and is ready to intreact with the fabric network'
          // );
          resolve()
        }).catch(err => {
          reject(err)
          console.error('Failed to register: ' + err);
          if (err.toString().indexOf('Authorization') > -1) {
            console.error(
              'Authorization failures may be caused by having admin credentials from a previous CA instance.\n' +
              'Try again after deleting the contents of the store directory ' +
              store_path
            );
          }
        });
      }
    });
  })
};

module.exports.registerUser = registerUser;
