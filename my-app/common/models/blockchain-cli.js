//hyperledger client sdk
const enrollAdminModule = require('../../client-application-fabric/enrollAdmin');
const registerUserModule = require('../../client-application-fabric/registerUser');
const queryLedgerModule = require('../../client-application-fabric/query');
const invokeLedgerModule = require('../../client-application-fabric/invoke');

module.exports = function(Blockchaincli) {
    Blockchaincli.status = function(cb) {
        // enrollAdminModule.enrollAdminUser('store-Path','http://localhost:10054','ca-Pl','Pl1MSP');
        // registerUserModule.registerUser('store-Path','http://localhost:10054','user4','Pl1MSP');

        queryLedgerModule.queryLedger('store-Path','mychannel1','grpc://localhost:12051','user4','cscc','GetChannels','[]');
        
        // queryLedgerModule.queryLedger('store-Path','mychannel1','grpc://localhost:12051','user4','mycc','query','["record1"]');
        // queryLedgerModule.queryLedger('store-Path','mychannel2','grpc://localhost:12051','user4','mycc','query','["record2"]');
        // invokeLedgerModule.invokeLedger('store-Path','mychannel4','grpc://localhost:12051','grpc://localhost:7050','user4','mycc','invoke','["recordOrg1ToPl1","asdasd111"]','grpc://localhost:12053');
        // invokeLedgerModule.invokeLedger('store-Path','mychannel4','grpc://localhost:12051','grpc://localhost:7050','user4','mycc','invoke','["recordOrg2ToPl1","asdasd222"]','grpc://localhost:12053');
        
        // invokeLedgerModule.invokeLedger('store-Path','mychannel3','grpc://localhost:12051','grpc://localhost:7050','user4','mycc','invoke','["record1Pl1ToOrg3","asdasd1"]','grpc://localhost:12053');
        // invokeLedgerModule.invokeLedger('store-Path','mychannel3','grpc://localhost:12051','grpc://localhost:7050','user4','mycc','invoke','["record2Pl1ToOrg3","asdasd2"]','grpc://localhost:12053');
        
        // queryLedgerModule.queryLedger('store-Path','mychannel1','grpc://localhost:12051','user4','mycc','query','["record1"]');
        // queryLedgerModule.queryLedger('store-Path','mychannel4','grpc://localhost:12051','user4','mycc','query','["recordOrg1ToPl1"]');
        // queryLedgerModule.queryLedger('store-Path','mychannel3','grpc://localhost:12051','user4','mycc','query','["record1Pl1ToOrg3"]');
         
        
        cb(null,{"orgs":[{"1":"Org1"},{"2":"Org2"}]})
    };
    
    Blockchaincli.remoteMethod(
      'status', {
        http: {
          path: '/status',
          verb: 'get',
          status: 200
        },
        returns: {
          arg: 'status',
          type: 'string'
        }
      }
    );
};
