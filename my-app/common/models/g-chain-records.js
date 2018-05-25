'use strict';
var MongoClient = require('mongodb').MongoClient;

//TODO handle exceptions
module.exports = function (Gchainrecords) {
    // Connect to the db
    var db=null;

    MongoClient.connect("mongodb://localhost:17017/g-chain-records",{ useNewUrlParser: true }, function (err, DB) {
        if (err) throw err;
        db = DB.db("g-chain-records");
        console.log("Connected mongoDB!");
    });

    Gchainrecords.getRecords = function (patientId,cb) {
        db.listCollections().toArray(function(err, collections){
            var cursors = [];
            for (let index = 0; index < collections.length; index++) {
                const collectionInfo = collections[index];
                const collection=db.collection(collectionInfo["name"]);
                var query = { identifier: patientId };
                collection.find(query).toArray(function(err,result) {
                    if (err) throw err;
                    cursors.push(result)
                });
            }
            console.log("Query done.")
            cb(null,cursors)
        });
    }

    Gchainrecords.addRecord = function (emr, cb) {
        let collectionName = emr["resourceType"];
        db.collection(collectionName)
            .insertOne(emr)
            .then(function (result) {
                console.log("Successfully added a new record.")
                cb(null,{"info":"Successfully added a new record."})
            })
    }

    Gchainrecords.remoteMethod('getRecords', {
        http: {
            path: '/getRecords',
            verb: 'get'
        },
        accepts: [
            {
                arg: 'patientId',
                required: true,
                type: 'string'
            }
        ],
        returns: {
            arg: 'records',
            type: 'Object',
        }
    });

    Gchainrecords.remoteMethod('addRecord', {
        http: {
            path: '/addRecord',
            verb: 'post'
        },
        accepts: [
            {
                arg: 'emr',
                required: true,
                type: 'Object'
            }
        ],
        returns: {
            arg: 'res',
            type: 'Object',
        }
    });
};