const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const UserModel = require("./registration/schema")

// Routes
const postsRoutes = require("./posts");
const experienceRoute = require("./experience");
const commentRoutes = require("./comments");
const userRouter = require("./registration");
const messagesRoute = require("./socketio/index")

const http = require("http");
const socketio = require("socket.io");
const { addMessage } = require("./socketio/addMessage");

// Express server
const server = express();

// http server starting from express server
const httpServer = http.createServer(server);

// sockeio server
const io = socketio(httpServer);

// Waiting for a connection
io.on("connection", async (socket) => {
  console.log(`New connection arrived: `, socket.id);

  // ricevi l'auth token
  // capisci chi è l'utente
  // salvi su db => ut ente.socketId
  // broadcast emit della lista di utenti attivi

  // Send messages to private users
  socket.on("privateMessage", async (options) => {
    await UserModel.findOneAndUpdate({
      senderUsername: options.senderUsername
    })
    await UserModel.updateOne({
      socketID: options.socketID
    })
    const userUpdated = await UserModel.findOne({
      senderUsername: options.senderUsername
    })
    console.log("The userUdated socketID")
    console.log(userUpdated.socketID)
    

   /*const query = {"senderUsername": options.senderUsername }
   const update = {
     "$set": {
       "socketID": options.socketID
      }
   }
   const option = { returnNewDocument: true }

   return UserModel.findOneAndUpdate(query, update, option)
   .then(updatedDocument => {
    if(updatedDocument) {
      console.log(`Successfully updated document: ${updatedDocument.socketID}.`)
    } else {
      console.log("No document matches the provided query.")
    }
    return updatedDocument
  })
  .catch(err => console.error(`Failed to find and update document: ${err}`))
  */

    //to sarà un userId o uno username
    //find sul db di quel userId o username
    //SE ha un socket attivo (socjketId != null)
    // emit di private message a sto socket
    // salvi su db
    //else
    //salvei su DB
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
