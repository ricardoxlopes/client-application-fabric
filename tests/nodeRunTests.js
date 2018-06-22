
const loadtest = require('loadtest');
const options = {
    url: 'http://localhost:5000/api/BlockchainClis/addPermission',
    maxRequests: 20,
    concurrency: 20,
    method: "POST",
    body: { "patientId": "patient", "permissions": [{ "access": "org1", "autorization": true }] },
    contentType: "application/json",
    statusCallback: statusCallback,
    timelimit: 10000000
};

const options1 = {
    url: 'http://localhost:5000/api/BlockchainClis/getPermission?patientId=cenas',
    maxRequests: 100,
    concurrency: 30,
    method: "GET",
    agentKeepAlive: 'Connection: Keep-alive',
    statusCallback: statusCallback
};
function statusCallback(error, result, latency) {
    if (result)
        console.log(latency.totalRequests)
    else console.log("error?")

    // console.log('Current latency %j, result %j, error %j', latency, result, error);
    // console.log('----');
    // console.log('Request elapsed milliseconds: ', result.requestElapsed);
    // console.log('Request index: ', result.requestIndex);
    // console.log('Request loadtest() instance index: ', result.instanceIndex);
}
// loadtest.loadTest(options, function(error, result)
// {
// 	if (error)
// 	{
// 		return console.error('Got an error: %s', error);
//     }
//     console.log(result)
// 	console.log('Tests run successfully');
// });

async function generateMultiplePatients() {

    for (let index = 110; index < 1000; index++) {
        const local = {
            url: 'http://localhost:5000/api/BlockchainClis/addPermission',
            maxRequests: 1,
            concurrency: 1,
            method: "POST",
            body: { "patientId": "patient" + index, "permissions": [{ "access": "org5", "autorization": true },
            { "access": "org1", "autorization": true },
            { "access": "org2", "autorization": true },
            { "access": "org3", "autorization": true },
            { "access": "org4", "autorization": true }] },
            contentType: "application/json",
            statusCallback: function () {
                console.log(index)
            },
            timelimit: 10000000
        };

        await new Promise((resolve, reject) => {
            loadtest.loadTest(local, (error, result) => {
                if (error) {
                    return console.error('Got an error: %s', error);
                }
                console.log(result)
                console.log('Tests run successfully');
                resolve()
            });
        })
    }

}

generateMultiplePatients()