var Fabric_Client = require('fabric-client');
var path = require('path');
var util = require('util');
var os = require('os');
var fs = require('fs');

var fabric_client = new Fabric_Client();

function queryLedger(queryObject) {
  return new Promise((resolve, reject) => {

    var member_user = null;
    var store_path = path.join(__dirname, queryObject.argPath);

    // create the key value store
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

      // get the enrolled user from persistence, this user will sign all requests
      return fabric_client.getUserContext(queryObject.argUser, true);
    }).then(user_from_store => {
      if (user_from_store && user_from_store.isEnrolled()) {
        console.log('Successfully loaded ' + queryObject.argUser + ' from persistence');
        member_user = user_from_store;
      } else {
        reject(new Error('Failed to get user.... run registerUser.js'));
      }

      var queriesRes = []
      return (async function loop() {
        for (let i = 0; i < queryObject.argRequests.length; i++)
          //TODO change 0 for i for multiple different channels
          await getChannel(queryObject, 0).queryByChaincode(queryObject.argRequests[i]).then(query_responses => {
            console.log('Query has completed, checking results');
            // query_responses could have more than one  results if there multiple peers were used as tqueryObject.argets
            if (query_responses && query_responses.length == 1) {
              if (query_responses[0] instanceof Error) {
                reject(query_responses[0])
                console.error('error from query = ', query_responses[0]);
              } else {
                queriesRes.push(JSON.parse(query_responses[0].toString()))
                console.log(JSON.parse(query_responses[0].toString()))
              }
            } else {
              reject(query_responses[0])
              console.log('No payloads were returned from query');
            }
          }).catch(err => {
            reject(err)
            console.error('Failed to query successfully :: ' + err);
          });
        resolve(queriesRes)
      })();
    })
  })
};

var getChannel = (queryObject, i) => {

  var channel = null

  try {
    channel = fabric_client.newChannel(queryObject.argChannels[i])
  } catch (e) {
    channel = fabric_client.getChannel(queryObject.argChannels[i])
  }

  var peer = null

  peer = fabric_client.newPeer(queryObject.argPeer);

  //check if peer was instantiated
  channel.getPeers().forEach(peeri => {
    if (peeri.getUrl() == queryObject.argPeer) {
      peer = false
    }
  })

  if (peer !== false) {
    channel.addPeer(peer);
  }

  return channel
}

module.exports.queryLedger = queryLedger;
