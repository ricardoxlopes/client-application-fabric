var Fabric_Client = require('fabric-client');
var path = require('path');
// var util = require('util');

function invokeLedger(invokeObject) {
    var fabric_client = new Fabric_Client();

    //instantiate channel
    var channel = fabric_client.newChannel(invokeObject.argChannel);
    //instantiate peer
    var peer = fabric_client.newPeer(invokeObject.argPeer);
    channel.addPeer(peer);
    //instantiate orderer
    var order = fabric_client.newOrderer(invokeObject.argOrderer);
    channel.addOrderer(order);

    // var member_user = null;
    var store_path = path.join(__dirname, invokeObject.argPath);
    // console.log('Store path:' + store_path);
    var tx_id = null;

    // create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
    return Fabric_Client.newDefaultKeyValueStore({
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
      return fabric_client.getUserContext(invokeObject.argUser, true);
    }).then(user_from_store => {
      if (user_from_store && user_from_store.isEnrolled()) {
        // console.log('Successfully loaded ', invokeObject.argUser, ' from persistence');
        member_user = user_from_store;
      } else {
        console.log('Failed to get ', invokeObject.argUser, ' .... run registerUser.js');
      }

      // get a transaction id object based on the current user assigned to fabric client
      tx_id = fabric_client.newTransactionID();
      // console.log('Assigning transaction_id: ', tx_id._transaction_id);

      var request = {
        //tinvokeObject.argets: let default to the peer assigned to the client
        chaincodeId: invokeObject.argChaincodeId,
        fcn: invokeObject.argFcn,
        args: [invokeObject.argInvokeArguments[0], JSON.stringify(invokeObject.argInvokeArguments[1])],
        txId: tx_id,
      };

      // send the transaction proposal to the peers
      return channel.sendTransactionProposal(request);
    }).then(results => {
      // console.log("CENASCENASCENASCENAS", results)
      var proposalResponses = results[0];
      var proposal = results[1];
      let isProposalGood = false;
      if (
        proposalResponses &&
        proposalResponses[0].response &&
        proposalResponses[0].response.status === 200
      ) {
        isProposalGood = true;
        // console.log('Transaction proposal was good');
      } else {
        console.error('Transaction proposal was bad');
        // reject('Transaction proposal was bad');
      }
      if (isProposalGood) {
        // console.log(
        //   util.format(
        //     'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s"',
        //     proposalResponses[0].response.status,
        //     proposalResponses[0].response.message
        //   )
        // );
        // resolve("Successfully sent Proposal and received ProposalResponse");
        // build up the request for the orderer to have the transaction committed
        var request = {
          proposalResponses: proposalResponses,
          proposal: proposal,
        };

        // set the transaction listener and set a timeout of 30 sec
        // if the transaction did not get committed within the timeout period,
        // report a TIMEOUT status
        var transaction_id_string = tx_id.getTransactionID(); //Get the transaction ID string to be used by the event processing
        var promises = [];

        var sendPromise = channel.sendTransaction(request)
        promises.push(sendPromise); //we want the send transaction first, so that we know where to check status

        // get an eventhub once the fabric client has a user assigned. The user
        // is required bacause the event registration must be signed
        let event_hub = fabric_client.newEventHub();
        event_hub.setPeerAddr(invokeObject.argPeerEvent);

        // using resolve the promise so that result status may be processed
        // under the then clause rather than having the catch clause process
        // the status
        let txPromise = new Promise((resolve, reject) => {
          let handle = setTimeout(() => {
            event_hub.disconnect();
            resolve({ event_status: 'TIMEOUT' }); //we could use reject(new Error('Trnasaction did not complete within 30 seconds'));
          }, 3000);
          event_hub.connect();
          event_hub.registerTxEvent(
            transaction_id_string,
            (tx, code) => {
              // this is the callback for transaction event status
              // first some clean up of event listener
              clearTimeout(handle);
              event_hub.unregisterTxEvent(transaction_id_string);
              event_hub.disconnect();

              // now let the application know what happened
              var return_status = {
                event_status: code,
                tx_id: transaction_id_string,
              };
                        if (code !== 'VALID') {
            // console.error('The transaction was invalid, code = ' + code);
            resolve(return_status); // we could use reject(new Error('Problem with the tranaction, event status ::'+code));
          } else {
            // console.log('The transaction has been committed on peer ' + event_hub._ep._endpoint.addr);
            resolve(return_status);
          }
            },
            err => {
              //this is the callback if something goes wrong with the event registration or processing
              reject(
                new Error('There was a problem with the eventhub ::' + err)
              );
            }
          );
        });
        promises.push(txPromise);

        return Promise.all(promises);
      } else {
        console.error(
          'Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...'
        );
        // reject(new Error(
        //   'Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...'
        // ));
      }
    })
};

module.exports.invokeLedger = invokeLedger;

