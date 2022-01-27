module.exports = (io) => {
  const getOnlineUsers = function (payload) {
    const socket = this;
    const usersSet = new Set(payload);
    const users = [];
    for (let [id, socket] of io.of("/").sockets) {
      const userId = socket.username;
      if (usersSet.has(userId)) {
        users.push(userId);
      }
    }
    socket.emit("online_users", users);
  };

  // const readOrder = function (orderId, callback) {
  //   // ...
  // };

  return {
    getOnlineUsers,
  };
};
