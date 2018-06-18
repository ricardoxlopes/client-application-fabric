var Fabric_Client = require('fabric-client');
var path = require('path');
// var util = require('util');
// var os = require('os');
var fs = require('fs');

// var superagent = require('superagent');
// var agent = require('superagent-promise')(require('superagent'), Promise);
// var requester = require('request');

var fabric_client = new Fabric_Client();

const enrollAdminModule = require('./enrollAdmin');
const registerUserModule = require('./registerUser');

var newChannelObject = { argPath: "store-Path3", argUser: "user3", argChannel: "mychannel", argPeer: 'grpc://localhost:7051', argOrderer: 'grpc://127.0.0.1:7050' };

enrollAdminModule.enrollAdminUser({ argPath: 'store-Path3', argCaUrl: 'http://localhost:7054', argCaName: 'ca-org1', argMspid: 'Org1MSP' }).then(() => {
    return registerUserModule.registerUser({ argPath: 'store-Path3', argCaUrl: 'http://localhost:7054', argUser: 'user3', argMspid: 'Org1MSP', argAffiliation: 'org1', argRole: 'client' }, fabric_client)
}).then(() => {
    createNewChannel(newChannelObject)
});


function getSignature(config_proto, index) {
    console.log("\nsimulateGetAllSignatures " + index + "\n")
    return new Promise((resolve, reject) => {
        // var signatures = []

        enrollObject = { argPath: 'store-Path1', argCaUrl: 'http://localhost:7054', argCaName: 'ca-org1', argMspid: 'Org1MSP' }
        // enrollObject2 = { argPath: 'store-Path2', argCaUrl: 'http://localhost:8054', argCaName: 'ca-org2', argMspid: 'Org2MSP' }
        // enrollObject3 = { argPath: 'store-Path3', argCaUrl: 'http://localhost:9054', argCaName: 'ca-org3', argMspid: 'Org3MSP' }
        // enrollObject4 = { argPath: 'store-Path1', argCaUrl: 'http://localhost:10054', argCaName: 'ca-Pl', argMspid: 'Pl1MSP' }
        // // enrollObject5={argPath: 'store-Path', argCaUrl: 'http://localhost:11054', argCaName: 'ca-OrgNew', argMspid: 'OrgNewMSP'}

        registerObject = { argPath: 'store-Path1', argCaUrl: 'http://localhost:7054', argUser: 'user1', argMspid: 'Org1MSP', argAffiliation: 'org1', argRole: 'client' }
        // registerObject2 = { argPath: 'store-Path2', argCaUrl: 'http://localhost:8054', argUser: 'user2', argMspid: 'Org2MSP', argAffiliation: 'org2', argRole: 'client' }
        // registerObject3 = { argPath: 'store-Path3', argCaUrl: 'http://localhost:9054', argUser: 'user3', argMspid: 'Org3MSP', argAffiliation: 'org3', argRole: 'client' }
        // registerObject4 = { argPath: 'store-Path1', argCaUrl: 'http://localhost:10054', argUser: 'user1', argMspid: 'Pl1MSP', argAffiliation: 'pl1', argRole: 'client' }
        // // registerObject5={argPath: 'store-Path', argCaUrl: 'http://localhost:11054', argUser: 'user5', argMspid: 'OrgNewMSP',argAffiliation: 'org1',argRole: 'client'}

        var enrolls = [enrollObject]
        var registers = [registerObject]

        // enrollAdminModule.enrollAdminUser(enrolls[index]).then(fabric_client1 => {

            var client = Fabric_Client.loadFromConfig('./network-config.yaml');
            client.loadFromConfig('./' + registers[index].argAffiliation + '.yaml');
            // fabric_client1.getUserContext('admin', true);

            // admin_key="-----BEGIN PRIVATE KEY-----MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQg75HtHbOMa7WklBA7kEZnHKIkAM0FKpx5KD2YkRzJ/56hRANCAARiBPhm3e7Scw5N9Ay2JQ5oR1IBdMvj/u1PaHQnpxwXWxHnSV9hHQcsFk9sJrONUoSoA8dVb1XR02U25Q2QNN3j-----END PRIVATE KEY-----"
            // admin_cert="-----BEGIN CERTIFICATE-----MIICKzCCAdGgAwIBAgIRAJX46Yzkl3RZPlJZVS9DPO0wCgYIKoZIzj0EAwIwczELMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNhbiBGcmFuY2lzY28xGTAXBgNVBAoTEG9yZzIuZXhhbXBsZS5jb20xHDAaBgNVBAMTE2NhLm9yZzIuZXhhbXBsZS5jb20wHhcNMTgwNTE3MTcxNjAzWhcNMjgwNTE0MTcxNjAzWjBsMQswCQYDVQQGEwJVUzETMBEGA1UECBMKQ2FsaWZvcm5pYTEWMBQGA1UEBxMNU2FuIEZyYW5jaXNjbzEPMA0GA1UECxMGY2xpZW50MR8wHQYDVQQDDBZBZG1pbkBvcmcyLmV4YW1wbGUuY29tMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEYgT4Zt3u0nMOTfQMtiUOaEdSAXTL4/7tT2h0J6ccF1sR50lfYR0HLBZPbCazjVKEqAPHVW9V0dNlNuUNkDTd46NNMEswDgYDVR0PAQH/BAQDAgeAMAwGA1UdEwEB/wQCMAAwKwYDVR0jBCQwIoAgmZM7GREivhyAw/7NQMjIvWph+g9GUqOtwGkturzTUbUwCgYIKoZIzj0EAwIDSAAwRQIhAPUhTcl99sVcFqLyL6LbP6TjmFYY/Z/LuUPPgwB3pw5CAiBwzfKFx2pgWJM6X0MLrUsO7b20baus7ETMEB8qhWEfJg==-----END CERTIFICATE-----"
            // client.setAdminSigningIdentity(admin_key,admin_cert,"Org2MSP") //,'Org2MSP');

            var signature = client.signChannelConfig(config_proto);
            // signatures.push(signature)

            // var signature = fabric_client1.signChannelConfig(config_proto);
            // console.log(signature)
            // collect signature
            resolve(signature)
        // })
    })
}


function createNewChannel(newChannelObject) {

    return new Promise((resolve, reject) => {
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

            // first read in the file, this gives us a binary config envelope
            let envelope_bytes = fs.readFileSync(path.join(__dirname, './channel-artifacts/mychannel.tx'));
            // have the nodeSDK extract out the config update
            var config_proto = fabric_client.extractChannelConfig(envelope_bytes);

            var signatures=[];
            var signature = fabric_client.signChannelConfig(config_proto);
            signatures.push(signature);

            getSignature(config_proto, 0).then(signature => {
                // collect signature
                // signatures.push(signature);
                signatures.push(signature)

                // create an orderer object to represent the orderer of the network
                var orderer = fabric_client.newOrderer(newChannelObject.argOrderer);

                // have the SDK generate a transaction id
                let tx_id = fabric_client.newTransactionID();

                request = {
                    config: config_proto, //the binary config
                    signatures: signatures, // the collected signatures
                    name: 'testchainid', // the channel name
                    orderer: orderer, //the orderer from above
                    txId: tx_id //the generated transaction id
                };

                // this call will return a Promise
                fabric_client.createChannel(request).then(res => {
                    console.log(res);
                    resolve(res)
                });
            });
        });
    });
}

module.exports.createNewChannel = createNewChannel;