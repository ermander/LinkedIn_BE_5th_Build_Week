const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const postsRoutes = require("./posts");
const experienceRoute = require("./experience");
const commentRoutes = require("./comments");
const routes = require("./app/routes");




const server = express();
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
server.use("/auth", routes);


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
    server.listen(port, () => {
      console.log(`working on port ${port}`);
    })
  );
mongoose.connection.on("connected", () => {
  console.log("connected");
});
