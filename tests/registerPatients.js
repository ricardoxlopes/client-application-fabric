var rp = require('request-promise');
var mysql = require('promise-mysql');
var pool = mysql.createPool("mysql://b09d80e3b40bed:0c7bf03e@eu-cdbr-west-02.cleardb.net/heroku_b8116f21146b486?reconnect=true")

var nPatients = 50;
var nOrgs = 8;

async function patients() {
    var promisesList = [];
    for (let index = 1; index < nPatients; index++) {
        var options = {
            method: 'POST',
            uri: 'http://localhost:5000/api/gChainIds/registerPatient',
            body: { 'firstName': 'fn' + index, 'lastName': 'ln' + index, 'email': index + '@e.pt', 'password': 'password' },
            json: true
        };
        promisesList.push(rp(options));
    }
    Promise.all(promisesList);
}

async function orgs() {
    var promisesList = [];
    for (let index = 0; index < nOrgs; index++) {
        var options = {
            method: 'POST',
            uri: 'http://localhost:5000/api/gChainIds/registerOrg',
            body: { 'name': 'org' + index, 'password': 'password' },
            json: true
        };
        promisesList.push(rp(options));
    }
    Promise.all(promisesList);
}

// var tokens = [];

async function orgsIds() {
    let sql = "SELECT id from organization"
    let result = await pool.query(sql);
    // pool.releaseConnection();
    if (result.length == 0)
        return { result: "invalid" };
    var ids = [];
    result.map((row, index) => {
        ids.push(row.id)
    });
    return ids;
}
async function patientsIds() {
    let sql = "SELECT id from patient"
    let result = await pool.query(sql);
    // pool.releaseConnection();
    if (result.length == 0)
        return { result: "invalid" };
    var ids = [];
    result.map((row, index) => {
        ids.push(row.id)
    });
    return ids;
}

async function tokens() {
    let sql = "SELECT token from token"
    let result = await pool.query(sql);
    // pool.release();
    if (result.length == 0)
        return { result: "invalid" };
    var tokensList = [];
    result.map((row, index) => {
        tokensList.push(row.token)
    });
    return tokensList;
}

async function token() {
    var promisesList = [];
    return patientsIds().then(patientIds => {
        for (let index = 0; index < patientIds.length; index++) {
            var random = Math.floor(Math.random() * patientIds.length)
            promisesList.push(rp('http://localhost:5000/api/gChainIds/getTrustableOrgToken?patientId=' + patientIds[random]));
        }
        return Promise.all(promisesList);
    })
}

async function association() {
    // console.log(tokens.length);
    var promisesList = [];
    return tokens().then(tokensList => {
        return orgsIds().then(orgsIds => {
            console.log(orgsIds)
            for (let index = 1; index < tokensList.length; index++) {
                var random = Math.floor(Math.random() * tokensList.length)
                var random1 = Math.floor(Math.random() * orgsIds.length)
                let tokenToVerify=tokensList[random]
                let orgId=orgsIds[random1]
                var options = {
                    method: 'POST',
                    uri: 'http://localhost:5000/api/gChainIds/registerAssociationPatientOrg',
                    body: { 'tokenToVerify': tokenToVerify, 'orgId': orgId },
                    json: true
                };
                promisesList.push(rp(options));
            }
            Promise.all(promisesList);
        });
    });
};

// patients();
// orgs();
async function cenas() {
    // await token();
    // .then(returnValues => {
    //     returnValues.map((token, index) => {
    //         tokens.push(token["token"])
    //         console.log("DONE.")
    //     });
    // });
    association();
}

cenas();

