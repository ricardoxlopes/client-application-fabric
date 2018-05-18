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
        chaincodeId: requests[i].argChaincodeId,
        fcn: requests[i].argFcn,
        args: [requests[i].argQueryArguments]
      };
      res.push(request)
    }
    return res;
  };

  //valores HARCODED TODO
  Blockchaincli.initialize = function (cb) {
    var channelNames = []
    var privateLedger = "mychannel"

    enrollAdminModule.enrollAdminUser('store-Path', 'http://localhost:10054', 'ca-Pl', 'Pl1MSP').then(() => {
      return registerUserModule.registerUser('store-Path', 'http://localhost:10054', 'user1', 'Pl1MSP','org1','client')
    }).then(() => {
      requests = generateRequest([{ argChaincodeId: "cscc", argFcn: "GetChannels", argQueryArguments: "[]" }])

      return queryLedgerModule.queryLedger({
        argPath: 'store-Path',
        argChannels: [privateLedger],
        argPeer: 'grpc://localhost:12051',
        argUser: 'user1',
        argRequests: requests
      });
    }).then((channels) => {
      //newline and page break
      channelNames = channels[0].split('\n\f\n\n')
      channelNames.shift()

      var requestArray = []
      for (let i = 0; i < channelNames.length; i++)
        requestArray.push({ argChaincodeId: "mycc", argFcn: "query", argQueryArguments: "info" })

      requestArray.push(
        { argChaincodeId: "mycc", argFcn: "rich_query", argQueryArguments: JSON.stringify({ "selector": { "_id": { "$gt": null } } }) })

      requests = generateRequest(requestArray);
      //copy of array
      var requestChannels = channelNames.slice();

      var index = requestChannels.indexOf(privateLedger);
      
      if (index > -1) {
        requestChannels.splice(index, 1);
      }
      //copy of array
      channelNames=requestChannels.slice()

      requestChannels.push(privateLedger)
      requestChannels.push(privateLedger)

      return queryLedgerModule.queryLedger({
        argPath: 'store-Path',
        argChannels: requestChannels,
        argPeer: 'grpc://localhost:12051',
        argUser: 'user1',
        argRequests: requests
      })
    }).then((info) => {
      //last element
      var records=info.splice(-1, 1);
      infoRecord=info.splice(-1, 1);
      var orgsNames=[]

      for (let index = 0; index < info.length; index++) {
        orgsNames.push(JSON.parse(info[index])["org"])
      }
      
      console.log({ orgs: info,orgsNames: orgsNames, channels: channelNames, walletRecords: [infoRecord[0],records[0],privateLedger]})
      cb(null, { orgs: info,orgsNames: orgsNames, channels: channelNames, walletRecords: [infoRecord[0],records[0],privateLedger]})
    })

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

  };
  //TODO FOR PATIENT
  Blockchaincli.getOrgRecords = function (channel, cb) {

    requests = generateRequest([{ argChaincodeId: "mycc", argFcn: "rich_query", argQueryArguments: JSON.stringify({ "selector": { "_id": { "$gt": null } } }) }])

    queryLedgerModule.queryLedger({
      argPath: 'store-Path',
      argChannels: [channel],
      argPeer: 'grpc://localhost:12051',
      argUser: 'user1',
      argRequests: requests
    }).then((records) => {
      cb(null,records);
    });
  };
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

  Blockchaincli.invoke = function (channel, record, cb) {
    console.log("ARGS RECEIVED INVOKE:",channel,record)
    invokeLedgerModule.invokeLedger({
      argPath: 'store-Path',
      argChannel: channel,
      argPeer: 'grpc://localhost:12051',
      argOrderer: 'grpc://localhost:7050',
      argUser: 'user1',
      argChaincodeId: 'mycc',
      argFcn: 'invoke',
      argInvokeArguments: record,
      argPeerEvent: 'grpc://localhost:12053'
    }).then((res) => {
      cb(null, JSON.stringify(res));
    });
  };

  Blockchaincli.getOrgPatients = function (cb) {
    var channelNames = []
    var privateLedger = "mychannel1"

    enrollAdminModule.enrollAdminUser('store-Path1', 'http://localhost:7054', 'ca-org1', 'Org1MSP').then(() => {
      return registerUserModule.registerUser('store-Path1', 'http://localhost:7054', 'user2', 'Org1MSP','org1','client')
    }).then(() => {
      requests = generateRequest([{ argChaincodeId: "cscc", argFcn: "GetChannels", argQueryArguments: "[]" }])

      return queryLedgerModule.queryLedger({
        argPath: 'store-Path1',
        argChannels: [privateLedger],
        argPeer: 'grpc://localhost:7051',
        argUser: 'user2',
        argRequests: requests
      });
    }).then((channels) => {
      //newline and page break
      channelNames = channels[0].split('\n\f\n\n')
      channelNames.shift()
      cb(null, channelNames);
    })
  };

  Blockchaincli.remoteMethod('getOrgPatients', {
    http: {
      path: '/patients',
      verb: 'get'
    },
    returns: {
      arg: 'patients',
      type: 'string',
    },
  });

  Blockchaincli.remoteMethod('initialize', {
    http: {
      path: '/init',
      verb: 'get'
    },
    returns: {
      arg: 'info',
      type: 'string',
    },
  });

  Blockchaincli.remoteMethod('getOrgRecords', {
    http: {
      path: '/records',
      verb: 'post'
    },
    accepts: {
      arg: 'channel',
      type: 'string'
    },
    returns: {
      arg: 'records',
      type: 'string',
    },
  });

  Blockchaincli.remoteMethod('invoke', {
    http: {
      path: '/invoke',
      verb: 'post'
    },
    accepts: [
      {
        arg: 'channel',
        type: 'string'
      },
      {
        arg: 'record',
        type: 'string'
      }
    ],
    returns: {
      arg: 'res',
      type: 'string',
    },
  });
};