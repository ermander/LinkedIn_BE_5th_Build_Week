const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const passport = require("passport");
const UserModel = require("./registration/schema");

// Routes
const postsRoutes = require("./posts");
const experienceRoute = require("./experience");
const commentRoutes = require("./comments");
const userRouter = require("./registration");
const messagesRoute = require("./socketio/index");

const http = require("http");
const socketio = require("socket.io");
const { saveMessages } = require("./socketio/saveMessages");

// Express server
const server = express();

// http server starting from express server
const httpServer = http.createServer(server);

// sockeio server
const io = socketio(httpServer);

// Waiting for a connection
io.on("connection", async (socket) => {
  console.log(`New connection arrived: `, socket.id);

  const { _id } = await verifyJWT(socket.handshake.query.token);
  // Cerco l'utente che ha mandato il messaggio
  await UserModel.findByIdAndUpdate(_id, {
    socketID: socket.id,
  });
  // Send messages to private users
  socket.on("privateMessage", async (options) => {
    const receiver = await UserModel.find({ username: options.to });
    const receiverSocket = receiver.socketID;
    const receiverObj = io.sockets.connected[receiverSocket];
    if (receiverObj) {
      receiverObj.emit("privateMessage", {
        options,
      });
    }

    // Finding the sender id to save the sender message with his id
    const findSenderId = await UserModel.findById({ _id: _id });
    const senderId = findSenderId._id;
    console.log("This is the sender _id", senderId);

    // Finding the reciever id to save the reciever message with his id
    const findRecieverID = await UserModel.findOne({ username: options.to });
    const recieverID = findRecieverID._id;
    console.log("This is the reciever _id : " + findRecieverID._id);

    await saveMessages(senderId, recieverID, options.text);

    io.to(options.to).emit("privateMessage", {
      from: options.from,
      to: options.to,
      text: options.text,
    });
  });

  //on disconnect
  // ritrovi l'utente e ci toglie il socketId
});

const listEndpoints = require("express-list-endpoints");

const {
  notFoundHandler,
  badRequestHandler,
  genericErrorHandler,
} = require("./errorHandlers");
const { verifyJWT } = require("./registration/authTools");

dotenv.config();

const port = process.env.PORT;
server.use(express.json());

server.use(cors());
server.use("/posts", postsRoutes);
server.use("/experience", experienceRoute);

server.use("/comments", commentRoutes);
server.use("/user", userRouter);
server.use("/messages", messagesRoute);

server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

console.log(listEndpoints(server));

const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING || 3003;
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
