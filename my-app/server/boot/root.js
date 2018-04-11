'use strict';

module.exports = function(server) {
 // 2. Move server status to '/status'
  // Install a `/status` route that returns server status
  var router = server.loopback.Router();
  router.get('/', server.loopback.status());

  // router.get('/ping', function(req, res) {
  //   res.send({"key":"pong"});
  // });
 
  // var block = server.models.BlockchainCli;

  server.use(router);
};


