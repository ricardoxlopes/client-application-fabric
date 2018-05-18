var Fabric_Client = require('fabric-client');
var path = require('path');
var util = require('util');
var os = require('os');
var fs = require('fs');

var fabric_client = new Fabric_Client();

const enrollAdminModule = require('./enrollAdmin');
const registerUserModule = require('./registerUser');

enrollAdminModule.enrollAdminUser('store-Path', 'http://localhost:7054', 'ca-org1', 'Org1MSP').then(() => {
    return registerUserModule.registerUser('store-Path', 'http://localhost:7054', 'user1', 'Org1MSP', 'Org1', 'Client')
}).then(() => {
    var newChannelObject = { argPath: "store-Path", argOrderer: 'grpc://localhost:7050', argPeer: 'grpc://localhost:7051', argChannel: 'mynewchannel', argUser: 'user1' }

    createNewChannel(newChannelObject)
});

function createNewChannel(newChannelObject) {

    return new Promise((resolve, reject) => {

        var member_user = null;
        var store_path = path.join(__dirname, newChannelObject.argPath);

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
            return fabric_client.getUserContext(newChannelObject.argUser, true);
        }).then(user_from_store => {
            if (user_from_store && user_from_store.isEnrolled()) {
                console.log('Successfully loaded ' + newChannelObject.argUser + ' from persistence');
                member_user = user_from_store;

            } else {
                reject('Failed to get user.... run registerUser.js')
                throw new Error('Failed to get user.... run registerUser.js');
            }

            config_envelope = fs.readFileSync(path.join(__dirname, './channel-artifacts/channel.tx'));

            var config_proto = fabric_client.extractChannelConfig(config_envelope)
            
            signatures = [];
            var signature = fabric_client.signChannelConfig(config_proto);
            signatures.push(signature);
            
            var orderer = fabric_client.newOrderer(newChannelObject.argOrderer);

            let tx_id = fabric_client.newTransactionID();
            request = {
                config: config_proto,
                signatures: signatures,
                name: newChannelObject.argChannel,
                orderer: orderer,
                txId: tx_id
            }

            fabric_client.createChannel(request).then((res) => {

                console.log(res)
                // fabric_client.updateChannel(request);

                var channel = getChannel(newChannelObject.argChannel)

                var orderer = fabric_client.newOrderer(newChannelObject.argOrderer);

                // set the channel up with network endpoints
                channel.addOrderer(orderer);

                var peer = fabric_client.newPeer(newChannelObject.argPeer);
                channel.addPeer(peer);

                tx_id = fabric_client.newTransactionID();
                let g_request = {
                    txId: tx_id
                };

                // var a=FileReader.readAsBinaryString(path.join(__dirname, './channel-artifacts/channel.tx'))

                // get the genesis block from the orderer
                channel.getGenesisBlock(g_request).then((block) => {
                    genesis_block = block;
                    tx_id = fabric_client.newTransactionID();
                    let j_request = {
                        targets: targets,
                        block: genesis_block,
                        txId: tx_id
                    };

                    // send genesis block to the peer
                    return channel.joinChannel(j_request);
                }).then((results) => {
                    if (results && results.response && results.response.status == 200) {
                        console.log("Successfully joined")
                        // join successful
                    } else {
                        console.log("not good")
                        // not good
                    }
                });
            })
        })
    })
}

module.exports.createNewChannel = createNewChannel;

function getChannel(channelName) {

    var channel = null

    try {
        channel = fabric_client.newChannel(channelName)
    } catch (e) {
        channel = fabric_client.getChannel(channelName)
    }

    return channel
}