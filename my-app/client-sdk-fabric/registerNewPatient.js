var Fabric_Client = require('fabric-client');
var path = require('path');
var util = require('util');
var os = require('os');
var fs = require('fs');

var superagent = require('superagent');
var agent = require('superagent-promise')(require('superagent'), Promise);
var requester = require('request');

var fabric_client = new Fabric_Client();

const enrollAdminModule = require('./enrollAdmin');
const registerUserModule = require('./registerUser');

var registerObject = { argPath: "store-Path", argUser: "user4", argChannel: "mychannel", argPeer: 'grpc://localhost:7051', argOrderer: 'grpc://localhost:7050' };

function getSignature(config_proto, index) {
    console.log("\nsimulateGetAllSignatures "+index+"\n")
    return new Promise((resolve, reject) => {
        // var signatures = []

        // enrollObject1 = { argPath: 'store-Path1', argCaUrl: 'http://localhost:7054', argCaName: 'ca-org1', argMspid: 'Org1MSP' }
        enrollObject2 = { argPath: 'store-Path2', argCaUrl: 'http://localhost:8054', argCaName: 'ca-org2', argMspid: 'Org2MSP' }
        enrollObject3 = { argPath: 'store-Path3', argCaUrl: 'http://localhost:9054', argCaName: 'ca-org3', argMspid: 'Org3MSP' }
        enrollObject4 = { argPath: 'store-Path1', argCaUrl: 'http://localhost:10054', argCaName: 'ca-Pl', argMspid: 'Pl1MSP' }
        // enrollObject5={argPath: 'store-Path', argCaUrl: 'http://localhost:11054', argCaName: 'ca-OrgNew', argMspid: 'OrgNewMSP'}

        // registerObject1 = { argPath: 'store-Path1', argCaUrl: 'http://localhost:7054', argUser: 'user1', argMspid: 'Org1MSP', argAffiliation: 'org1', argRole: 'client' }
        registerObject2 = { argPath: 'store-Path2', argCaUrl: 'http://localhost:8054', argUser: 'user2', argMspid: 'Org2MSP', argAffiliation: 'org2', argRole: 'client' }
        registerObject3 = { argPath: 'store-Path3', argCaUrl: 'http://localhost:9054', argUser: 'user3', argMspid: 'Org3MSP', argAffiliation: 'org3', argRole: 'client' }
        registerObject4 = { argPath: 'store-Path1', argCaUrl: 'http://localhost:10054', argUser: 'user1', argMspid: 'Pl1MSP', argAffiliation: 'pl1', argRole: 'client' }
        // registerObject5={argPath: 'store-Path', argCaUrl: 'http://localhost:11054', argUser: 'user5', argMspid: 'OrgNewMSP',argAffiliation: 'org1',argRole: 'client'}
        
        var enrolls = [enrollObject4, enrollObject2, enrollObject3]
        var registers = [registerObject4, registerObject2, registerObject3]

        enrollAdminModule.enrollAdminUser(enrolls[index]).then(fabric_client1 => {
            
            var client = Fabric_Client.loadFromConfig('./network-config.yaml');
            client.loadFromConfig('./'+registers[index].argAffiliation+'.yaml');
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
        })
    })}


//         // // .then(() => {
//             return registerUserModule.registerUser(registers[index], fabric_client1)
//         }).then(fabric_client1 => {
//             // var member_user = null;
//             var store_path = path.join(__dirname, registers[index].argPath);
//             // var fabric_client1 = new Fabric_Client();

//             // create the key value store
//             Fabric_Client.newDefaultKeyValueStore({
//                 path: store_path,
//             }).then(state_store => {
//                 // assign the store to the fabric client
//                 fabric_client1.setStateStore(state_store);
//                 var crypto_suite = Fabric_Client.newCryptoSuite();
//                 // use the same location for the state store (where the users' certificate are kept)
//                 // and the crypto store (where the users' keys are kept)
//                 var crypto_store = Fabric_Client.newCryptoKeyStore({ path: store_path });
//                 crypto_suite.setCryptoKeyStore(crypto_store);
//                 fabric_client1.setCryptoSuite(crypto_suite);

//                 // get the enrolled user from persistence, this user will sign all requests
//                 return fabric_client1.getUserContext(registers[index].argUser, true);
//             })
//                 .then(user_from_store => {
//                     if (user_from_store && user_from_store.isEnrolled()) {
//                         console.log('Successfully loaded ' + registers[index].argUser + ' from persistence');
//                         member_user = user_from_store;

//                     } else {
//                         reject('Failed to get user.... run registerUser.js')
//                         throw new Error('Failed to get user.... run registerUser.js');
//                     }

//                     admin_key="-----BEGIN PRIVATE KEY-----MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQg75HtHbOMa7WklBA7kEZnHKIkAM0FKpx5KD2YkRzJ/56hRANCAARiBPhm3e7Scw5N9Ay2JQ5oR1IBdMvj/u1PaHQnpxwXWxHnSV9hHQcsFk9sJrONUoSoA8dVb1XR02U25Q2QNN3j-----END PRIVATE KEY-----"
//                     admin_cert="-----BEGIN CERTIFICATE-----MIICKzCCAdGgAwIBAgIRAJX46Yzkl3RZPlJZVS9DPO0wCgYIKoZIzj0EAwIwczELMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNhbiBGcmFuY2lzY28xGTAXBgNVBAoTEG9yZzIuZXhhbXBsZS5jb20xHDAaBgNVBAMTE2NhLm9yZzIuZXhhbXBsZS5jb20wHhcNMTgwNTE3MTcxNjAzWhcNMjgwNTE0MTcxNjAzWjBsMQswCQYDVQQGEwJVUzETMBEGA1UECBMKQ2FsaWZvcm5pYTEWMBQGA1UEBxMNU2FuIEZyYW5jaXNjbzEPMA0GA1UECxMGY2xpZW50MR8wHQYDVQQDDBZBZG1pbkBvcmcyLmV4YW1wbGUuY29tMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEYgT4Zt3u0nMOTfQMtiUOaEdSAXTL4/7tT2h0J6ccF1sR50lfYR0HLBZPbCazjVKEqAPHVW9V0dNlNuUNkDTd46NNMEswDgYDVR0PAQH/BAQDAgeAMAwGA1UdEwEB/wQCMAAwKwYDVR0jBCQwIoAgmZM7GREivhyAw/7NQMjIvWph+g9GUqOtwGkturzTUbUwCgYIKoZIzj0EAwIDSAAwRQIhAPUhTcl99sVcFqLyL6LbP6TjmFYY/Z/LuUPPgwB3pw5CAiBwzfKFx2pgWJM6X0MLrUsO7b20baus7ETMEB8qhWEfJg==-----END CERTIFICATE-----"
//                     fabric_client1.setAdminSigningIdentity(admin_key,admin_cert,"Org2MSP") //,'Org2MSP');
                    
//                     var signature = fabric_client1.signChannelConfig(config_proto);
//                     // signatures.push(signature)

//                     // var signature = member_user.signChannelConfig(config_proto);
//                     // var signature = fabric_client1.signChannelConfig(config_proto);
//                     // collect signature
//                     resolve(signature)
//                 });
//         })
//     });

// }


enrollAdminModule.enrollAdminUser({ argPath: 'store-Path', argCaUrl: 'http://localhost:7054', argCaName: 'ca-org1', argMspid: 'Org1MSP' }).then(() => {
    return registerUserModule.registerUser({ argPath: 'store-Path', argCaUrl: 'http://localhost:7054', argUser: 'user4', argMspid: 'Org1MSP', argAffiliation: 'org1', argRole: 'client' },fabric_client)
}).then(() => {
    registerNewPatient(registerObject)
});

function registerNewPatient(registerObject) {

    return new Promise((resolve, reject) => {

        var config_proto = null;
        var original_config_proto = null;
        var original_config_json = null;
        var updated_config_proto = null;
        var updated_config_json = null;

        var member_user = null;
        var store_path = path.join(__dirname, registerObject.argPath);

        // var orderer = fabric_client.newOrderer(
        //     ORGS.orderer.url,
        //     {
        //         'pem': caroots,
        //         'ssl-target-name-override': ORGS.orderer['server-hostname']
        //     }
        // );
        var orderer = fabric_client.newOrderer(registerObject.argOrderer);



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
                return fabric_client.getUserContext(registerObject.argUser, true);
            })
            .then(user_from_store => {
                if (user_from_store && user_from_store.isEnrolled()) {
                    console.log('Successfully loaded ' + registerObject.argUser + ' from persistence');
                    member_user = user_from_store;

                } else {
                    reject('Failed to get user.... run registerUser.js')
                    throw new Error('Failed to get user.... run registerUser.js');
                }

                var channel = getChannel(registerObject.argChannel, registerObject.argPeer)
                channel.addOrderer(orderer)
                
                // tx_id = fabric_client.newTransactionID();
                // let g_request = {
                // txId :     tx_id
                // };
        
                // // get the genesis block from the orderer
                // channel.getGenesisBlock(g_request).then((block) =>{
                // // genesis_block = block;
                // // tx_id = fabric_client.newTransactionID();
                // // let j_request = {
                // //     targets : targets,
                // //     block : genesis_block,
                // //     txId :     tx_id
                // // };
                // console.log(block)
                // })

                

                var configEnvelop = channel.getChannelConfig().then(config_envelope => {
                    // console.log(config_envelope)
                    original_config_proto = config_envelope.config.toBuffer();
                    fs.writeFileSync('./original_config_proto', original_config_proto);
                    // lets get the config converted into JSON, so we can edit JSON to
                    // make our changes
                    return agent.post('http://127.0.0.1:7059/protolator/decode/common.Config',
                        original_config_proto)
                        .buffer();
                }).then(response => {
                   
                    original_config_json = response.text.toString();
                    fs.writeFileSync('./original_config_json', original_config_json);
                    // make a copy of the original so we can edit it
                    updated_config_json = original_config_json;
                    var updated_config = JSON.parse(updated_config_json);

                    // now edit the config -- remove one of the organizations
                    // console.log(updated_config.channel_group.groups.Application.groups.Org1MSP.policies.Admins.policy.value.identities)
                    org_content = fs.readFileSync('orgNewContent.json');

                    // if (channel_name == 'testchainid') {
                    //     updated_config.channel_group.groups.Consortiums.groups.SampleConsortium.groups[orgMSP] = JSON.parse(org_content);
                    // } else {
                    updated_config.channel_group.groups.Application.groups["orgNewMSP"] = JSON.parse(org_content);
                    
                    updated_config_json = JSON.stringify(updated_config);

                    fs.writeFileSync('./updated_config_json', updated_config_json);

                    // lets get the updated JSON encoded
                    return agent.post('http://127.0.0.1:7059/protolator/encode/common.Config',
                        updated_config_json.toString())
                        .buffer();
                }).then(response => {
                    updated_config_proto = response.body;
                    fs.writeFileSync('./updated_config_proto', updated_config_proto);
                    var formData = {
                        channel: registerObject.argChannel,
                        original: {
                            value: original_config_proto,
                            options: {
                                filename: 'original.proto',
                                contentType: 'application/octet-stream'
                            }
                        },
                        updated: {
                            value: updated_config_proto,
                            options: {
                                filename: 'updated.proto',
                                contentType: 'application/octet-stream'
                            }
                        }
                    };

                    return new Promise((resolve, reject) => {
                        requester.post({
                            url: 'http://127.0.0.1:7059/configtxlator/compute/update-from-configs',
                            encoding: null,
                            headers: {
                                accept: '/',
                                expect: '100-continue'
                            },
                            formData: formData
                        }, function optionalCallback(err, res, body) {
                            if (err) {
                                console.log(err)
                                // t.fail('Failed to get the updated configuration ::'+err);
                                reject(err);
                            } else {
                                var proto = Buffer.from(body, 'binary');
                                resolve(proto);
                            }
                        });
                    });

                    // return new Promise((resolve, reject) => {
                    //     requester.post({
                    //         url: 'http://127.0.0.1:7059/configtxlator/compute/update-from-configs',
                    //         formData: formData
                    //     }, function optionalCallback(err, res, body) {
                    //         if (err) {
                    //             t.fail('Failed to get the updated configuration ::' + err);
                    //             reject(err);
                    //         } else {
                    //             var proto = Buffer.from(body, 'binary');
                    //             resolve(proto);
                    //         }
                    //     });
                    // });
                }).then(response => {
                    console.log("GET SIGNATURES")
                    config_proto = response;
                    fs.writeFileSync('./config_proto', config_proto);
                    // will have to now collect the signatures
                    signatures = []; //clear out the above
                    // make sure we do not reuse the user
                    // fabric_client._userContext = null;

                    // the_user = admin;

                    // sign the config
                    var signature = fabric_client.signChannelConfig(config_proto);
                    // signatures.push(signature)
                    // console.log(signatures)
                    getSignature(config_proto, 0).then(signature => {
                        // collect signature
                        // signatures.push(signature);
                        signatures.push(signature)
                        return getSignature(config_proto, 1).then(signature => {
                            // collect signature
                            // signatures.push(signature);
                            signatures.push(signature)
                            return getSignature(config_proto, 2).then(signature => {
                                // collect signature
                                // signatures.push(signature);
                                signatures.push(signature)
                                
                                // var fabric_client = Fabric_Client.loadFromConfig('./network-config.yaml');

                                // build a client context and load it with a connection profile
                                // lets only load the network settings and save the client for later
                                // fabric_client = Fabric_Client.loadFromConfig(Fabric_Client.getConfigSetting('network'+config));

                                // This will load a connection profile over the top of the current one one
                                // since the first one did not have a client section and the following one does
                                // nothing will actually be replaced.
                                // This will also set an admin identity because the organization defined in the
                                // client section has one defined
                                // fabric_client.loadFromConfig(Fabric_Client.getConfigSetting('Org2'+config));

                                // console.log(signatures)
                                

                                // console.log(signature.signature_header)
                                // build up the create request
                                let tx_id = fabric_client.newTransactionID();
                                request = {
                                    config: config_proto,
                                    signatures: signatures,
                                    name: registerObject.argChannel,
                                    orderer: orderer,
                                    txId: tx_id
                                };

                                // this will send the update request to the orderer
                                return fabric_client.updateChannel(request);
                            }).then((result) => {
                                console.log(result)
                                if (result.status && result.status === 'SUCCESS') {
                                    console.log('Successfully updated the channel.');

                                    //return e2eUtils.sleep(5000);
                                } else {
                                    console.log('Failed to update the channel. ');
                                }
                            }).catch((err) => {
                                console.log('Unexpected error ' + err);
                            });
                        })
                    })
                });

            })
    })
};

function getChannel(channelName, argPeer) {

    var channel = null

    try {
        channel = fabric_client.newChannel(channelName)
    } catch (e) {
        channel = fabric_client.getChannel(channelName)
    }

    var peer = null

    peer = fabric_client.newPeer(argPeer);

    //check if peer was instantiated
    channel.getPeers().forEach(peeri => {
        if (peeri.getUrl() == argPeer) {
            peer = false
        }
    })

    if (peer !== false) {
        channel.addPeer(peer);
    }

    return channel
}

module.exports.registerNewPatient = registerNewPatient;