module.exports = function (io) {
  io.use((socket, next) => {
    const username = socket.handshake.auth.username;
    if (!username) {
      return next(new Error("invalid username"));
    }
    socket.username = username;
    next();
  });

  const { getOnlineUsers } = require("./handlers/usersHandler")(io);

  const onConnection = (socket) => {
    socket.on("online_users:get", getOnlineUsers);
  };

  io.on("connection", onConnection);
};
