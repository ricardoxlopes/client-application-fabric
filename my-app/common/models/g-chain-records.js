'use strict';
var MongoClient = require('mongodb').MongoClient;

module.exports = function (Gchainrecords) {
    // Connect to the db
    var db = null;

    MongoClient.connect("mongodb://localhost:17017/g-chain-records", { useNewUrlParser: true }, function (err, DB) {
        if (err) throw err;
        db = DB.db("g-chain-rc");
        console.log("Connected mongoDB!");
    });

    Gchainrecords.getRecords = function (patientId, cb) {
        //get list of collections
        db.listCollections().toArray().then(collections => {
            //query each collections for all documents from patientId
            return (async function loop() {
                var cursors = [];
                for (let index = 0; index < collections.length; index++) {
                    const collectionInfo = collections[index];
                    const collection = db.collection(collectionInfo["name"]);
                    var query = { identifier: patientId };
                    await collection.find(query).toArray().then(result => {
                        cursors=cursors.concat(result)
                    }).catch(err => {
                        console.error('Failed to query successfully :: ' + err);
                        cb(err);
                    });
                }
                cb(null, cursors)
            })();
        }).catch(err => {
            reject(err)
            console.error('Failed to get collections list successfully :: ' + err);
        });
    }

    Gchainrecords.addRecord = function (emr, cb) {
        let collectionName = emr["resourceType"];
        db.collection(collectionName)
            .insertOne(emr)
            .then(function (result) {
                console.log("Successfully added a new record.")
                cb(null, { "info": "Successfully added a new record." })
            }).catch(err => {
                console.log('Failed to add record successfully :: ' + err);
                cb(err);
            });
    }

    Gchainrecords.remoteMethod('getRecords', {
        http: {
            errorStatus: 400,
            status: 200,
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
            errorStatus: 400,
            status: 200,
            path: '/addRecord',
            verb: 'post'
        },
        accepts: [
            {
                arg: 'record',
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