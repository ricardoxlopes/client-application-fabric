//hyperledger client sdk
const enrollAdminModule = require('../../client-sdk-fabric/enrollAdmin');
const registerUserModule = require('../../client-sdk-fabric/registerUser');
const queryLedgerModule = require('../../client-sdk-fabric/query');
const invokeLedgerModule = require('../../client-sdk-fabric/invoke');

module.exports = function (Blockchaincli) {
  function generateRequest(requests) {
    var res = []

    for (let i = 0; i < requests.length; i++) {
      const request = {
        //targets : --- letting this default to the peers assigned to the channel
        chaincodeId: requests[i].chaincodeId,
        fcn: requests[i].fcn,
        args: requests[i].args
      };
      res.push(request);
    }
    return res;
  };

  // //valores HARCODED TODO
  // Blockchaincli.initialize = function (cb) {
  //   var channelNames = []
  //   var privateLedger = "mychannel"

  //   enrollAdminModule.enrollAdminUser('store-Path', 'http://localhost:10054', 'ca-Pl', 'Pl1MSP').then(() => {
  //     return registerUserModule.registerUser('store-Path', 'http://localhost:10054', 'user1', 'Pl1MSP','org1','client')
  //   }).then(() => {
  //     requests = generateRequest([{ argChaincodeId: "cscc", argFcn: "GetChannels", argQueryArguments: "[]" }])

  //     return queryLedgerModule.queryLedger({
  //       argPath: 'store-Path',
  //       argChannels: [privateLedger],
  //       argPeer: 'grpc://localhost:12051',
  //       argUser: 'user1',
  //       argRequests: requests
  //     });
  //   }).then((channels) => {
  //     //newline and page break
  //     channelNames = channels[0].split('\n\f\n\n')
  //     channelNames.shift()

  //     var requestArray = []
  //     for (let i = 0; i < channelNames.length; i++)
  //       requestArray.push({ argChaincodeId: "mycc", argFcn: "query", argQueryArguments: "info" })

  //     requestArray.push(
  //       { argChaincodeId: "mycc", argFcn: "rich_query", argQueryArguments: JSON.stringify({ "selector": { "_id": { "$gt": null } } }) })

  //     requests = generateRequest(requestArray);
  //     //copy of array
  //     var requestChannels = channelNames.slice();

  //     var index = requestChannels.indexOf(privateLedger);

  //     if (index > -1) {
  //       requestChannels.splice(index, 1);
  //     }
  //     //copy of array
  //     channelNames=requestChannels.slice()

  //     requestChannels.push(privateLedger)
  //     requestChannels.push(privateLedger)

  //     return queryLedgerModule.queryLedger({
  //       argPath: 'store-Path',
  //       argChannels: requestChannels,
  //       argPeer: 'grpc://localhost:12051',
  //       argUser: 'user1',
  //       argRequests: requests
  //     })
  //   }).then((info) => {
  //     //last element
  //     var records=info.splice(-1, 1);
  //     infoRecord=info.splice(-1, 1);
  //     var orgsNames=[]

  //     for (let index = 0; index < info.length; index++) {
  //       orgsNames.push(JSON.parse(info[index])["org"])
  //     }

  //     console.log({ orgs: info,orgsNames: orgsNames, channels: channelNames, walletRecords: [infoRecord[0],records[0],privateLedger]})
  //     cb(null, { orgs: info,orgsNames: orgsNames, channels: channelNames, walletRecords: [infoRecord[0],records[0],privateLedger]})
  //   })

  // queryLedgerModule.queryLedger('store-Path','mychannel1','grpc://localhost:12051','user4','cscc','GetChannels','[]');

  // queryLedgerModule.queryLedger('store-Path','mychannel1','grpc://localhost:12051','user4','mycc','query','["record1"]');
  // queryLedgerModule.queryLedger('store-Path','mychannel2','grpc://localhost:12051','user4','mycc','query','["record2"]');
  // invokeLedgerModule.invokeLedger('store-Path','mychannel4','grpc://localhost:12051','grpc://localhost:7050','user4','mycc','invoke','["recordOrg1ToPl1","asdasd111"]','grpc://localhost:12053');
  // invokeLedgerModule.invokeLedger('store-Path','mychannel4','grpc://localhost:12051','grpc://localhost:7050','user4','mycc','invoke','["recordOrg2ToPl1","asdasd222"]','grpc://localhost:12053');

  // invokeLedgerModule.invokeLedger('store-Path','mychannel3','grpc://localhost:12051','grpc://localhost:7050','user4','mycc','invoke','["record1Pl1ToOrg3","asdasd1"]','grpc://localhost:12053');
  // invokeLedgerModule.invokeLedger('store-Path','mychannel3','grpc://localhost:12051','grpc://localhost:7050','user4','mycc','invoke','["record2Pl1ToOrg3","asdasd2"]','grpc://localhost:12053');

  // queryLedgerModule.queryLedger('store-Path','mychannel1','grpc://localhost:12051','user4','mycc','query','["record1"]');
  // queryLedgerModule.queryLedger('store-Path','mychannel4','grpc://localhost:12051','user4','mycc','query','["recordOrg1ToPl1"]');
  // queryLedgerModule.queryLedger('store-Path','mychannel3','grpc://localhost:12051','user4','mycc','query','["record1Pl1ToOrg3"]');

  // };
  //TODO FOR PATIENT
  // Blockchaincli.getOrgRecords = function (channel, cb) {

  //   requests = generateRequest([{ argChaincodeId: "mycc", argFcn: "rich_query", argQueryArguments: JSON.stringify({ "selector": { "_id": { "$gt": null } } }) }])

  //   queryLedgerModule.queryLedger({
  //     argPath: 'store-Path',
  //     argChannels: [channel],
  //     argPeer: 'grpc://localhost:12051',
  //     argUser: 'user1',
  //     argRequests: requests
  //   }).then((records) => {
  //     cb(null, records);
  //   });
  // };
  //TODO FOR ORG
  // Blockchaincli.getOrgRecords = function (channel, cb) {
  //   requests = generateRequest([{ argChaincodeId: "mycc", argFcn: "rich_query", argQueryArguments: JSON.stringify({ "selector": { "_id": { "$gt": null } } }) }])

  //   queryLedgerModule.queryLedger({
  //     argPath: 'store-Path1',
  //     argChannels: [channel],
  //     argPeer: 'grpc://localhost:7051',
  //     argUser: 'user2',
  //     argRequests: requests
  //   }).then((records) => {
  //     cb(null, records);
  //   });
  // };

  Blockchaincli.addPermission = function (patientId, permission, cb) {
    // console.log("Permission to invoke ", permission)
    var storePath = 'store-Path' + patientId;

    var enrollObject = { argPath: storePath, argCaUrl: 'http://localhost:15054', argCaName: 'ca-Pl', argMspid: 'Pl1MSP' };
    var registerUserObject = { argPath: storePath, argCaUrl: 'http://localhost:15054', argUser: patientId, argMspid: 'Pl1MSP', argAffiliation: 'pl1', argRole: 'client' };
    var invokeObject = {
      argPath: storePath,
      argChannel: "mychannel",
      argPeer: 'grpc://localhost:17051',
      argOrderer: 'grpc://localhost:7050',
      argUser: patientId,
      argChaincodeId: 'mycc',
      argFcn: 'invoke',
      argInvokeArguments: [patientId, permission],
      argPeerEvent: 'grpc://localhost:17053'
    };

    // enrollAdminModule.enrollAdminUser(enrollObject).then(() => {
    //   return registerUserModule.registerUser(registerUserObject);
    // }).then(() => {
      invokeLedgerModule.invokeLedger(invokeObject).then((results) => {
        // console.log('Send transaction promise and event listener promise have completed');
        // check the results in the order the promises were added to the promise all list
        if (results && results[0] && results[0].status === 'SUCCESS') {
          // console.log('Successfully sent transaction to the orderer.');
        } else {
          console.error('Failed to order the transaction. Error code: ' + results[0].status);
          cb(new Error("error"),null)
        }
        if (results && results[1] && results[1].event_status === 'VALID') {
          // console.log('Successfully committed the change to the ledger by the peer');
          // console.log("ok");
          cb(null, 'Successfully committed the change to the ledger by the peer');
        } else {
          console.log('Transaction failed to be committed to the ledger due to ::' + results[1].event_status);
          cb(new Error("error"),null)
        }
      }).catch((err) => {
        console.error('Failed to invoke successfully, add permissions :: ' + err);
        cb(new Error("error"),null)
      });
    // });
  }

  Blockchaincli.getPermission = function (patientId, cb) {
    var storePath = 'store-Path' + patientId;
    var enrollObject = { argPath: storePath, argCaUrl: 'http://localhost:7054', argCaName: 'ca-org1', argMspid: 'Org1MSP' };
    var registerUserObject = { argPath: storePath, argCaUrl: 'http://localhost:7054', argUser: patientId, argMspid: 'Org1MSP', argAffiliation: 'org1', argRole: 'client' };
    var request = [{ chaincodeId: "mycc", fcn: "query", args: [patientId] }];
    var queryObject = {
      argPath: storePath,
      argChannels: ["mychannel"],
      argPeer: 'grpc://localhost:7051',
      argUser: patientId,
      argRequests: request
    };
    // enrollAdminModule.enrollAdminUser(enrollObject).then(() => {
    //   return registerUserModule.registerUser(registerUserObject);
    // }).then(() => {
      queryLedgerModule.queryLedger(queryObject).then(res => {
        cb(null, res);
      });
    // }).catch(err => {
    //   console.error('Failed to get permissions :: ' + err);
    //   cb(err, "Error")
    // });
  }

  Blockchaincli.getAllPermissions = function (patientIds, cb) {
    var storePath = 'store-Path' + patientId;
    var enrollObject = { argPath: storePath, argCaUrl: 'http://localhost:7054', argCaName: 'ca-org1', argMspid: 'Org1MSP' };
    var registerUserObject = { argPath: storePath, argCaUrl: 'http://localhost:7054', argUser: patientId, argMspid: 'Org1MSP', argAffiliation: 'org1', argRole: 'client' };
    var requestObject = [];
    var patientIdsArray = patientIds["ids"];

    for (let index = 0; index < patientIdsArray.length; index++)
      requestObject.push({ chaincodeId: "mycc", fcn: "query", args: [patientIdsArray[index]] });

    requests = generateRequest(requestObject);

    var queryObject = {
      argPath: storePath,
      argChannels: ["mychannel"],
      argPeer: 'grpc://localhost:7051',
      argUser: patientId,
      argRequests: requests
    };

    enrollAdminModule.enrollAdminUser(enrollObject).then(() => {
      return registerUserModule.registerUser(registerUserObject);
    }).then(() => {
      queryLedgerModule.queryLedger(queryObject).then(res => {
        console.log(res)
        cb(null, res);
      }).catch(err => {
        console.error('Failed to get permissions :: ' + err);
        cb(err, "Error")
      });
    }).catch(err => {
      console.error('Failed to get permissions :: ' + err);
      cb(err, "Error")
    });

    // enrollAdminModule.enrollAdminUser('store-Path', 'http://localhost:7054', 'ca-org1', 'Org1MSP').then(() => {
    //   return registerUserModule.registerUser('store-Path', 'http://localhost:7054', 'user', 'Org1MSP', 'org1', 'client')
    // }).then(() => {
    //   //select
    //   // let query = JSON.stringify({ patientId: patientId });

    //   // requests = generateRequest([{ argChaincodeId: "mycc", argFcn: "rich_query", argQueryArguments: "[" + query + "]" }])


    //   return queryLedgerModule.queryLedger();
    // }).then(records => {
    //   console.log(records)
    //   cb(null, records);
    // })
  };

  // Blockchaincli.remoteMethod('initialize', {
  //   http: {
  //     path: '/init',
  //     verb: 'get'
  //   },
  //   returns: {
  //     arg: 'info',
  //     type: 'string',
  //   },
  // });

  Blockchaincli.remoteMethod('getAllPermissions', {
    http: {
      errorStatus: 400,
      status: 200,
      path: '/getAllPermissions',
      verb: 'post'
    },
    accepts: {
      arg: 'patientIds',
      required: true,
      type: 'Object'
    },
    returns: {
      arg: 'permissions',
      type: 'Object',
    },
  });

  Blockchaincli.remoteMethod('getPermission', {
    http: {
      errorStatus: 400,
      status: 200,
      path: '/getPermission',
      verb: 'get'
    },
    accepts: {
      arg: 'patientId',
      required: true,
      type: 'string'
    },
    returns: {
      arg: 'permission',
      type: 'Object',
    },
  });

  Blockchaincli.remoteMethod('addPermission', {
    http: {
      errorStatus: 400,
      status: 200,
      path: '/addPermission',
      verb: 'post'
    },
    accepts: [
      {
        arg: 'patientId',
        required: true,
        type: 'string'
      },
      {
        arg: 'permissions',
        required: true,
        type: 'array'
      }
    ],
    returns: {
      arg: 'res',
      type: 'Object',
    },
  });
};