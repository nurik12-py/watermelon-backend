module.exports = function (io) {
    io.on('connection', (socket) => {


        //    console.log(user_id);
        socket.on('exchangeSDP', (data) => {

            socket.to(data.to_connid).emit('exchangeSDP', {
                message: data.message,
                from_connid: socket.id
            });

        }); //end of exchangeSDP
        socket.on('reset', (data) => {
            var userObj = _userConnections.find(p => p.connectionId == socket.id);
            if (userObj) {
                var meetingid = userObj.meeting_id;
                var list = _userConnections.filter(p => p.meeting_id == meetingid);
                _userConnections = _userConnections.filter(p => p.meeting_id != meetingid);

                list.forEach(v => {
                    socket.to(v.connectionId).emit('reset');
                });

                socket.emit('reset');
            }

        }); //end of reset

        socket.on('disconnect', function () {
            console.log('Got disconnect!');
            var userObj = _userConnections.find(p => p.connectionId == socket.id);
            if (userObj) {
                var meetingid = userObj.meeting_id;

                _userConnections = _userConnections.filter(p => p.connectionId != socket.id);
                var list = _userConnections.filter(p => p.meeting_id == meetingid);
                console.log(`disconnected socket id   ${socket.id}`);
                console.log(`connection id: ${connectionId} socket id:${socket.id}`);
                list.forEach(v => {
                    socket.to(v.connectionId).emit('informAboutConnectionEnd', socket.id);
                });
            }

        })
        socket.on('message', function (message) {
            var data;

            try {
                data = JSON.parse(message);
            } catch (e) {
                console.log("Invalid JSON");
                data = {};
            }

            switch (data.type) {

                case "login":
                    if (users[data.name]) {
                        sendToOtherUser(socket, {
                            type: "login",
                            success: false
                        })
                    } else {
                        users[data.name] = socket;
                        socket.name = data.name

                        sendToOtherUser(socket, {
                            type: "login",
                            success: true
                        })
                    }

                    break;
                case "offer":

                    var connect = users[data.name];
                    if (connect != null) {
                        socket.otherUser = data.name;

                        sendToOtherUser(connect, {
                            type: "offer",
                            offer: data.offer,
                            name: socket.name
                        })
                    }
                    break;

                case "answer":

                    var connect = users[data.name];

                    if (connect != null) {
                        socket.otherUser = data.name
                        sendToOtherUser(connect, {
                            type: "answer",
                            answer: data.answer
                        })
                    }

                    break

                case "candidate":

                    var connect = users[data.name];

                    if (connect != null) {
                        sendToOtherUser(connect, {
                            type: "candidate",
                            candidate: data.candidate
                        })
                    }
                    break;
                case "reject":

                    var connect = users[data.name];

                    if (connect != null) {
                        sendToOtherUser(connect, {
                            type: "reject",
                            name: socket.name
                        })
                    }
                    break;
                case "accept":

                    var connect = users[data.name];

                    if (connect != null) {
                        sendToOtherUser(connect, {
                            type: "accept",
                            name: socket.name
                        })
                    }
                    break;
                case "leave":
                    var connect = users[data.name];
                    connect.otherUser = null;

                    if (connect != null) {
                        sendToOtherUser(connect, {
                            type: "leave"
                        })
                    }

                    break;

                default:
                    sendToOtherUser(socket, {
                        type: "error",
                        message: "Command not found: " + data.type
                    });
                    break;
            }


        })
        socket.on('close', function () {
            console.log('Connection closed');
            if (socket.name) {
                delete users[socket.name];
                if (socket.otherUser) {
                    var connect = users[socket.otherUser];
                    socket.otherUser = null;

                    if (socket != null) {
                        sendToOtherUser(connect, {
                            type: "leave"
                        })
                    }
                }
            }
        })

        socket.send("Hello World");

    })

    function sendToOtherUser(connection, message) {
        connection.send(JSON.stringify(message))
    }

};