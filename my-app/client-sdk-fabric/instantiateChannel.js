var Fabric_Client = require('fabric-client');
var path = require('path');
var util = require('util');
var os = require('os');
var fs = require('fs');

var fabric_client = new Fabric_Client();

var instantiateObject = { argUser: "patient", argChannels: ["mychannel"], argPeer: "grpc://localhost:7051", argPath: "store-Path"+"patient", argChaincodeId: "mycc", argChaincodeVersion: "1.0" };

instantiateChannel(instantiateObject);

function instantiateChannel(instantiateObject) {
    return new Promise((resolve, reject) => {

        var member_user = null;
        var store_path = path.join(__dirname, instantiateObject.argPath);
        var error_message = null;

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
                return fabric_client.getUserContext(instantiateObject.argUser, true);
            })
            .then(user_from_store => {
                if (user_from_store && user_from_store.isEnrolled()) {
                    console.log('Successfully loaded ' + instantiateObject.argUser + ' from persistence');
                    member_user = user_from_store;

                } else {
                    reject('Failed to get user.... run registerUser.js')
                    throw new Error('Failed to get user.... run registerUser.js');
                }

                var fabric_client = Fabric_Client.loadFromConfig('./network-config.yaml');
                fabric_client.loadFromConfig('./org1.yaml');

                var channel = getChannel(instantiateObject, 0);

                // var peer = null

                // peer = fabric_client.newPeer("grpc://localhost:8051");

                // var tx_id = fabric_client.newTransactionID(true); //get an admin transactionID
                // console.log('Assigning transaction_id: ', tx_id._transaction_id);
                // var request = {
                //     targets: [peer],
                //     chaincodePath: "chaincode",
                //     chaincodeId: "mycc",
                //     chaincodeVersion: "1.0",
                //     channelNames: ["mychannel"]
                // };
                // let results = fabric_client.installChaincode(request).then(proposal => {
                //     var proposalResponses = results[0];
                //     var proposal = results[1];
                //     var error_message = "";

                //     var all_good = true;
                //     for (var i in proposalResponses) {
                //         let one_good = false;
                //         if (proposalResponses && proposalResponses[i].response &&
                //             proposalResponses[i].response.status === 200) {
                //             one_good = true;
                //             console.log('install proposal was good');
                //         } else {
                //             console.log('install proposal was bad %j', proposalResponses.toJSON());
                //         }
                //         all_good = all_good & one_good;
                //     }
                //     if (all_good) {
                //         console.log('Successfully sent install Proposal and received ProposalResponse');
                //     } else {
                //         error_message = 'Failed to send install Proposal or receive valid response. Response null or status is not 200'
                //         console.log(error_message);
                //     }

                //     if (!error_message) {
                //         let message = 'Successfully install chaincode';
                //         // build a response to send back to the REST caller
                //         let response = {
                //             success: true,
                //             message: message
                //         };
                //         return response;
                //     } else {
                //         let message =error_message;
                //         throw new Error(message);
                //     }
                //     // console.log('Installed successfully');
                // }).catch(function (err) {
                //     console.error('Failed to install successfully :: ' + err);
                //     reject(err)
                // });



                // get a transaction id object based on the current user assigned to fabric client
                var tx_id = fabric_client.newTransactionID(true)
                console.log('Assigning transaction_id: ', tx_id._transaction_id);
                var deployId = tx_id.getTransactionID();
                // var endorsement = {
                //     identities: [
                //         { role: { name: "peer", mspId: "Org1MSP" } }
                //     ],
                //     policy: {
                //         "1-of": [{ "signed-by": 1 }]
                //     }
                // };

                var peer = null

                peer = fabric_client.newPeer("grpc://localhost:7051");

                var request = { targets: [peer],chaincodeType: "golang",chaincodeId: instantiateObject.argChaincodeId, chaincodeVersion: instantiateObject.argChaincodeVersion, txId: tx_id };//, 'endorsement-policy': endorsement};

                const timeout = 1000;

                channel.sendInstantiateProposal(request, timeout).then(results => {
                    // the returned object has both the endorsement results
                    // and the actual proposal, the proposal will be needed
                    // later when we send a transaction to the orderer
                    var proposalResponses = results[0];
                    var proposal = results[1];

                    // lets have a look at the responses to see if they are
                    // all good, if good they will also include signatures
                    // required to be committed
                    var all_good = true;
                    for (var i in proposalResponses) {
                        let one_good = false;
                        if (proposalResponses && proposalResponses[i].response &&
                            proposalResponses[i].response.status === 200) {
                            one_good = true;
                            console.log('instantiate proposal was good');
                        } else {
                            console.log('instantiate proposal was bad',proposalResponses);
                        }
                        all_good = all_good & one_good;
                    }
                    if (all_good) {
                        console.log(
                            'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s", metadata - "%s", endorsement signature: %s',
                            proposalResponses[0].response.status, proposalResponses[0].response.message,
                            proposalResponses[0].response.payload, proposalResponses[0].endorsement.signature);

                        // wait for the channel-based event hub to tell us that the
                        // instantiate transaction was committed on the peer
                        var promises = [];
                        let event_hubs = channel.getChannelEventHubsForOrg();
                        console.log('found %s eventhubs for this organization %s', event_hubs.length, "ORG1 TODO");
                        event_hubs.forEach((eh) => {
                            let instantiateEventPromise = new Promise((resolve, reject) => {
                                console.log('instantiateEventPromise - setting up event');
                                let event_timeout = setTimeout(() => {
                                    let message = 'REQUEST_TIMEOUT:' + eh.getPeerAddr();
                                    console.log(message);
                                    eh.disconnect();
                                }, 60000);
                                eh.registerTxEvent(deployId, (tx, code, block_num) => {
                                    console.log('The chaincode instantiate transaction has been committed on peer %s', eh.getPeerAddr());
                                    console.log('Transaction %s has status of %s in blocl %s', tx, code, block_num);
                                    clearTimeout(event_timeout);

                                    if (code !== 'VALID') {
                                        let message = until.format('The chaincode instantiate transaction was invalid, code:%s', code);
                                        console.log(message);
                                        reject(new Error(message));
                                    } else {
                                        let message = 'The chaincode instantiate transaction was valid.';
                                        console.log(message);
                                        resolve(message);
                                    }
                                }, (err) => {
                                    clearTimeout(event_timeout);
                                    console.log(err);
                                    reject(err);
                                },
                                    // the default for 'unregister' is true for transaction listeners
                                    // so no real need to set here, however for 'disconnect'
                                    // the default is false as most event hubs are long running
                                    // in this use case we are using it only once
                                    { unregister: true, disconnect: true }
                                );
                                eh.connect();
                            });
                            promises.push(instantiateEventPromise);
                        });

                        var orderer_request = {
                            txId: tx_id, // must include the transaction id so that the outbound
                            // transaction to the orderer will be signed by the admin
                            // id as was the proposal above, notice that transactionID
                            // generated above was based on the admin id not the current
                            // user assigned to the 'client' instance.
                            proposalResponses: proposalResponses,
                            proposal: proposal
                        };
                        var sendPromise = channel.sendTransaction(orderer_request);
                        // put the send to the orderer last so that the events get registered and
                        // are ready for the orderering and committing
                        promises.push(sendPromise);
                        let results = Promise.all(promises).then(() => {
                            console.log(util.format('------->>> R E S P O N S E : %j', results));
                            let response = results.pop(); //  orderer results are last in the results
                            if (response.status === 'SUCCESS') {
                                console.log('Successfully sent transaction to the orderer.');
                            } else {
                                error_message = util.format('Failed to order the transaction. Error code: %s', response.status);
                                console.log(error_message);
                            }

                            // now see what each of the event hubs reported
                            for (let i in results) {
                                let event_hub_result = results[i];
                                let event_hub = event_hubs[i];
                                console.log('Event results for event hub :%s', event_hub.getPeerAddr());
                                if (typeof event_hub_result === 'string') {
                                    console.log(event_hub_result);
                                } else {
                                    if (!error_message) error_message = event_hub_result.toString();
                                    console.log(event_hub_result.toString());
                                }
                            }
                        });

                    } else {
                        error_message = util.format('Failed to send Proposal and receive all good ProposalResponse');
                        console.log(error_message);
                    }
                    if (!error_message) {
                        console.log('Successfully instantiate chaingcode in organization %s to the channel \'%s\'',
                            "ORG1 TODO", instantiateObject.argChannels[0]);
                    } else {
                        console.log('Failed to instantiate. cause:%s', error_message);
                        throw new Error(error_message);
                    }
                }).catch(function (err) {
                    reject(err)
                    console.error('Failed to instantiate successfully :: ' + err);
                });
            })
    })
};

var getChannel = (instantiateObject, i) => {

    var channel = null

    try {
        channel = fabric_client.newChannel(instantiateObject.argChannels[i])
    } catch (e) {
        channel = fabric_client.getChannel(instantiateObject.argChannels[i])
    }

    var peer = null

    peer = fabric_client.newPeer(instantiateObject.argPeer);

    //check if peer was instantiated
    channel.getPeers().forEach(peeri => {
        if (peeri.getUrl() == instantiateObject.argPeer) {
            peer = false
        }
    })

    if (peer !== false) {
        channel.addPeer(peer);
    }

    return channel
}

module.exports.instantiateChannel = instantiateChannel;
