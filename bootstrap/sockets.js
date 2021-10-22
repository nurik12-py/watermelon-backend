module.exports = function (io) {
    activeUsers = {}
    io.on('connection', (socket) => {
        //    console.log(user_id);
        socket.on('join', (data) => {
            const { id, email } = data;
            activeUsers[email] = id;
        });

        socket.on('call', (data) => {
            const { email, caller } = data;
            console.log(caller);
            io.to(activeUsers[email]).emit('onCall', { caller });
        });

        socket.on('accept', (data) => {
            const { caller } = data;
            io.to(activeUsers[caller]).emit('onAccept', '');
        });

        socket.on('reject', (data) => {
            const { caller } = data;
            io.to(activeUsers[caller]).emit('onReject', '');
        });
    });
};