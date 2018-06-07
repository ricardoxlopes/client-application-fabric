
const loadtest = require('loadtest');
const options = {
	url: 'http://localhost:5000/api/BlockchainClis/addPermission',
    maxRequests: 10,
    concurrency: 1,
    method: "POST",
    body: {"patientId":"cenas","permission":{}},
    contentType: "application/json",
    // statusCallback: statusCallback
};
const options1 = {
	url: 'http://localhost:5000/api/BlockchainClis/getPermission?patientId=cenas',
    maxRequests: 100000,
    concurrency: 100,
    method: "GET",
    agentKeepAlive: 'Connection: Keep-alive',
    // statusCallback: statusCallback
};
function statusCallback(error, result, latency) {
    console.log('Current latency %j, result %j, error %j', latency, result, error);
    console.log('----');
    console.log('Request elapsed milliseconds: ', result.requestElapsed);
    console.log('Request index: ', result.requestIndex);
    console.log('Request loadtest() instance index: ', result.instanceIndex);
}
loadtest.loadTest(options1, function(error, result)
{
	if (error)
	{
		return console.error('Got an error: %s', error);
    }
    console.log(result)
	console.log('Tests run successfully');
});