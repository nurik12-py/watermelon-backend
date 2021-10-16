require("express-async-errors");
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
const compression = require("compression");
app.use(compression());
app.use(cors());
// require("./bootstrap/db")();
// require("./bootstrap/routes")(app);
require("./bootstrap/sockets")(io);
require("./bootstrap/config")();


const port = process.env.PORT || 4000;
server.listen(port, () => console.log(`App is listening on port: ${port}`));