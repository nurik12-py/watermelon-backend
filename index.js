require("express-async-errors");
require("dotenv").config();

const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
require("./bootstrap/db")();
require("./bootstrap/routes")(app);
require("./sockets/sockets")(io);
require("./bootstrap/config")();

const port = process.env.PORT || 4000;
server.listen(port, () =>
  console.log(`App is listening on port: http://localhost:${port}`)
);
