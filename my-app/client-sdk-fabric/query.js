var Fabric_Client = require('fabric-client');
var path = require('path');
var util = require('util');
var os = require('os');

var fabric_client = new Fabric_Client();

function queryLedger(
  argPath,
  argChannel,
  argPeer,
  argUser,
  argChaincodeId,
  argFcn,
  argQueryArguments
){
  return new Promise((resolve,reject) => {

  var channel=null

  try{
    channel = fabric_client.newChannel(argChannel)
  }catch(e){
    channel = fabric_client.getChannel(argChannel)
  }

  var peer=null

  peer = fabric_client.newPeer(argPeer);

  //check if peer was instantiated
  channel.getPeers().forEach(peeri => {
      if (peeri.getUrl() == argPeer){
        peer=false
      }
  })

  if (peer !== false){
    channel.addPeer(peer);
  }

  var member_user = null;
  var store_path = path.join(__dirname, argPath);

  // create the key value store
  Fabric_Client.newDefaultKeyValueStore({
    path: store_path,
  })
    .then(state_store => {
      // assign the store to the fabric client
      fabric_client.setStateStore(state_store);
      var crypto_suite = Fabric_Client.newCryptoSuite();
      // use the same location for the state store (where the users' certificate are kept)
      // and the crypto store (where the users' keys are kept)
      var crypto_store = Fabric_Client.newCryptoKeyStore({ path: store_path });
      crypto_suite.setCryptoKeyStore(crypto_store);
      fabric_client.setCryptoSuite(crypto_suite);

      // get the enrolled user from persistence, this user will sign all requests
      return fabric_client.getUserContext(argUser, true);
    })
    .then(user_from_store => {
      if (user_from_store && user_from_store.isEnrolled()) {
        console.log('Successfully loaded ' + argUser + ' from persistence');
        member_user = user_from_store;
        
      } else {
        throw new Error('Failed to get user.... run registerUser.js');
      }

      const request = {
        //targets : --- letting this default to the peers assigned to the channel
        chaincodeId: argChaincodeId,
        fcn: argFcn,
        args: JSON.parse(argQueryArguments)//argQueryArguments),
      };

      return channel.queryByChaincode(request);
    })
    .then(query_responses => {
      console.log('Query has completed, checking results');
      // query_responses could have more than one  results if there multiple peers were used as targets
      if (query_responses && query_responses.length == 1) {
        if (query_responses[0] instanceof Error) {
          reject(err)
          console.error('error from query = ', query_responses[0]);
        } else {
          console.log(query_responses[0].toString())
          resolve(query_responses[0].toString())
        } 
      } else {
        reject(err)
        console.log('No payloads were returned from query');
      }
    })
    .catch(err => {
      reject(err)
      console.error('Failed to query successfully :: ' + err);
    });
})};

module.exports.queryLedger = queryLedger;
