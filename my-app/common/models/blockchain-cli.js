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

  //valores HARCODED TODO //provavelmente dá erro se a ordem não for a correta
  //é preciso saber destinguir o ledger pessoal dos não pessoais
  Blockchaincli.initialize = function (cb) {
    var channelNames=[]
    var privateLedger="mychannel4"

    enrollAdminModule.enrollAdminUser('store-Path', 'http://localhost:10054', 'ca-Pl', 'Pl1MSP').then(() => {
      return registerUserModule.registerUser('store-Path', 'http://localhost:10054', 'user1', 'Pl1MSP')
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
      // channelNames.forEach(function(currentValue,index){
      //    channelNames[index]=+channelNames[index]+"\""
      // });
      var requestArray = []

      for (let i = 0; i < channelNames.length; i++)
        requestArray.push({ argChaincodeId: "mycc", argFcn: "query", argQueryArguments: "info" })

      requestArray.push(
          { argChaincodeId: "mycc", argFcn: "rich_query", argQueryArguments: JSON.stringify({ "selector": { "_id": { "$gt": null } } }) })
      
      requests = generateRequest(requestArray);

      var requestChannels = channelNames.slice();
      requestChannels.push(privateLedger)

      return queryLedgerModule.queryLedger({
        argPath: 'store-Path',
        argChannels: requestChannels,
        argPeer: 'grpc://localhost:12051',
        argUser: 'user1',
        argRequests: requests 
      })
    }).then((info) => {
      console.log(JSON.stringify({ orgs: [info[0], info[1], info[2],info[3]], channels: channelNames, records: info[4] }))
      cb(null, JSON.stringify({ orgs: [info[0], info[1], info[2],info[3]], channels: channelNames, records: info[4] }))
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

  Blockchaincli.getOrgRecords = function (channel, cb) {

    requests = generateRequest([{ argChaincodeId: "mycc", argFcn: "rich_query", argQueryArguments: JSON.stringify({ "selector": { "_id": { "$gt": null } } }) }])
      
    queryLedgerModule.queryLedger({
      argPath: 'store-Path',
      argChannels: [channel],
      argPeer: 'grpc://localhost:12051',
      argUser: 'user1',
      argRequests: requests 
    }).then((records) => {
        cb(null, JSON.stringify(records));
    });
  };

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
      arg: 'org',
      type: 'string'
    },
    returns: {
      arg: 'records',
      type: 'string',
    },
  });
};
