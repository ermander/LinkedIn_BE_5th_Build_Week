const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const postsRoutes = require("./posts");
const experienceRoute = require("./experience");
const commentRoutes = require("./comments");
const http = require("http")
const socketio = require("socket.io")

// Express server
const server = express();

// http server starting from express server
const httpServer = http.createServer(server)

// sockeio server
const io = socketio(httpServer)

// Waiting for a connection
io.on("connection", (socket) => {
  console.log(`New connection arrived: `, socket.id)   

  // Send messages to private users
  socket.on("privateMessage", async (options) => {
    io.to(options.to).emit("message", {
      from: options.username,
      to: options.to,
      text: options.text
    })
  })

})

const listEndpoints = require("express-list-endpoints");
const profilesRouter = require("./profiles/index");
const {
  notFoundHandler,
  badRequestHandler,
  genericErrorHandler,
} = require("./errorHandlers");

dotenv.config();

const port = process.env.PORT;
server.use(express.json());

server.use(cors());
server.use("/posts", postsRoutes);
server.use("/profile", experienceRoute);
server.use("/profile", profilesRouter);
server.use("/comments", commentRoutes);

server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

console.log(listEndpoints(server));


const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING
mongoose
  .connect(MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    httpServer.listen(port, () => {
      console.log(`working on port ${port}`);
    })
  );
mongoose.connection.on("connected", () => {
  console.log("connected to atlas");
});
