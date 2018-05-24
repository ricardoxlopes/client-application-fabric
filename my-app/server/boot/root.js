'use strict';

module.exports = function(server) {
 // 2. Move server status to '/status'
  // Install a `/status` route that returns server status
  var router = server.loopback.Router();
  router.get('/', server.loopback.status());

  // var block = server.models.BlockchainCli;

  server.use(router);
};


