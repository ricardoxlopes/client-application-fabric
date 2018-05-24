'use strict';
var MongoClient = require('mongodb').MongoClient;

module.exports = function (Gchainrecords) {
    // Connect to the db

    MongoClient.connect("mongodb://localhost:17017/g-chain-records", function (err, db) {
        if (err) throw err;
        var db = db;
        console.log("Connected mongoDB!");
    });

    Gchainrecords.getRecords = function (patientId, organizationId, cb) {
        var collectionsNames = this.db.collection_names();
        var cursors = [];
        for (let index = 0; index < collectionsNames.length; index++) {
            const collection = this.db[collectionsNames[index]];
            cursors.push(collection.find({ "id": patientId }))
        }
    }

    Gchainrecords.addRecord = function (collectionName, record, cb) {
        db.collection(collectionName)
            .insertOne(record)
            .then(function (result) {
                console.log("Successfully added a new record.")
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
                arg: 'patientId',
                required: true,
                type: 'string'
            },
            {
                arg: 'emr',
                required: true,
                type: 'Object'
            },
            {
                arg: 'organizationId',
                required: true,
                type: 'string'
            }
        ],
        returns: {
            arg: 'res',
            type: 'Object',
        }
    });

};