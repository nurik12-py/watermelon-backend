
module.exports = function (io) {
    var rooms = {}
    io.on('connection', (socket) => {
        console.log("New user connected");
        socket.on('join', function (data) {
            const userData = JSON.parse(data);
            if (!(userData.roomId in rooms)) {
                rooms[userData.roomId] = [userData];
            } else {
                const currentRoom = rooms[userData.roomId];
                var isAlreadyHere = false;
                for (var i = 0; i < currentRoom.length; i++) {
                    if (currentRoom[i].email == userData.email) {
                        isAlreadyHere = true;
                    }
                }
                if (!isAlreadyHere) {
                    rooms[userData.roomId].push(userData);
                }
            }
            socket.join(userData.roomId);
            console.log(rooms);
            io.to(userData.roomId).emit('newUser', rooms[userData.roomId]);
        });
        socket.on("leave", function (data) {
            rooms[data.roomId] = rooms[data.roomId].filter(user => user.email != data.email);
            io.to(data.roomId).emit('newUser', rooms[data.roomId]);
        })
    });
};
