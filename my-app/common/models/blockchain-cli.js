//hyperledger client sdk
const enrollAdminModule = require('../../client-sdk-fabric/enrollAdmin');
const registerUserModule = require('../../client-sdk-fabric/registerUser');
const queryLedgerModule = require('../../client-sdk-fabric/query');
const invokeLedgerModule = require('../../client-sdk-fabric/invoke');

module.exports = function(Blockchaincli) {
  Blockchaincli.initialize = function(cb) {
      var channelNames
      enrollAdminModule.enrollAdminUser('store-Path','http://localhost:10054','ca-Pl','Pl1MSP').then(() => {
      return registerUserModule.registerUser('store-Path','http://localhost:10054','user2','Pl1MSP')
      }).then(() => {
        return queryLedgerModule.queryLedger('store-Path','mychannel4','grpc://localhost:12051','user2','cscc','GetChannels','[]')
      }).then((channels) => {
        //newline and page break
        channelNames=channels.split('\n\f\n\n')
        channelNames.shift()
        // channelNames.forEach(function(currentValue,index){
        //    channelNames[index]=+channelNames[index]+"\""
        // }); 
        return queryLedgerModule.queryLedger('store-Path','mychannel1','grpc://localhost:12051','user2','mycc','query','["record1"]')
      }).then((resRecords) => {
        //console.log(JSON.stringify({ "orgs": channelNames, "records": records}))
        cb(null,JSON.stringify({ orgs: channelNames,records: resRecords}))//, records: resRecords})//, records: {"a":"a","b":"b"}});
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

Blockchaincli.getOrgRecords = function(org,cb) {
    queryLedgerModule.queryLedger('store-Path',org,'grpc://localhost:12051','user1','mycc','query','["record1"]')
      .then((records) => {
        console.log(records)
        cb(null,JSON.stringify(records));
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
