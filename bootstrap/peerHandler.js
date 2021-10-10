const peer = require("peer");

module.exports = function (app, server) {
    app.use('/peerjs', peer.ExpressPeerServer(server, {
        debug: true
    }))
};
