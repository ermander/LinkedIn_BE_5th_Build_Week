const express = require("express");
const q2m = require("query-to-mongo");
const { authenticate, refreshToken } = require("./authTools");
const { authorize } = require("../middlewares/authorize");
const { verifyJWT } = require("./authTools");
const UserModel = require("./schema");
const loginRouter = express.Router();
const multer = require("multer");
const fs = require("fs-extra");
const path = require("path");
const upload = multer({});
const passport = require("passport");

loginRouter.get("/", async (req, res, next) => {
  try {
    const query = q2m(req.query);
    const users = await UserModel.find(query.criteria, query.options.fields)
      .skip(query.options.skip)
      .limit(query.options.limit)
      .sort(query.options.sort);

    res.send(users);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

loginRouter.get("/bytoken/:token", async (req, res, next) => {
  try {
    const token = req.params.token;
    const { _id } = await verifyJWT(token);
    const user = await UserModel.findById(_id);
    res.send(user);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

loginRouter.get("/:_id", async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params._id).populate(
      "experiences"
    );
    console.log(user);
    res.send(user);
  } catch (error) {
    next(error);
  }
});

loginRouter.get("/byUsername/:username", async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ username: req.params.username });
    if (user) {
      res.send(user);
    }
  } catch (error) {
    next(error);
    console.log(error);
  }
});

// Implementare l'upload di un'immagine direttamente in fase di registrazione
loginRouter.post("/signup", async (req, res, next) => {
  try {
    console.log(req.body);
    const newUser = new UserModel(req.body);
    const { _id } = await newUser.save();
    console.log("user saved");
    res.status(201).send({ _id });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

loginRouter.post("/login", async (req, res, next) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;
    const user = await UserModel.findByCredentials(email, password);
    const tokens = await authenticate(user);
    res.send(tokens);
  } catch (error) {
    next(error);
  }
});

loginRouter.post("/refreshToken", async (req, res, next) => {
  const oldRefreshToken = req.body.refreshToken;
  if (!oldRefreshToken) {
    const err = new Error("Forbidden");
    err.httpStatusCode = 403;
    next(err);
  } else {
    try {
      const newTokens = await refreshToken(oldRefreshToken);
      res.send(newTokens);
    } catch (error) {
      console.log(error);
      const err = new Error(error);
      err.httpStatusCode = 403;
      next(err);
    }
  }
});

loginRouter.post("/logout", authorize, async (req, res, next) => {
  try {
    req.user.refreshTokens = req.user.refreshTokens.filter(
      (t) => t.token !== req.body.refreshToken
    );
    await req.user.save();
    res.send();
  } catch (err) {
    next(err);
  }
});

loginRouter.put(
  "/:id/uploadImage",
  upload.single("image"),
  async (req, res) => {
    const imagesPath = path.join(__dirname, "/images");
    await fs.writeFile(
      path.join(
        imagesPath,
        req.params.id + "." + req.file.originalname.split(".").pop()
      ),
      req.file.buffer
    );

    var obj = {
      image: fs.readFileSync(
        path.join(
          __dirname +
          "/images/" +
          req.params.id +
          "." +
          req.file.originalname.split(".").pop()
        )
      ),
    };

    await UserModel.findByIdAndUpdate(req.params.id, obj);
    res.send("image added successfully");
  }
);

loginRouter.delete("/:id", authorize, async (req, res, next) => {
  try {
    await req.user.remove();
    res.send("Deleted");
  } catch (error) {
    next(error);
  }
});

loginRouter.get(
  "/auth/linkedin",
  passport.authenticate("linkedin", { state: "SOME STATE" }),
  function (req, res) {
    // The request will be redirected to LinkedIn for authentication, so this
    // function will not be called.
  }
);

loginRouter.get(
  "/auth/linkedin/callback",
  passport.authenticate("linkedin", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);
loginRouter.get('/auth/facebook',
  passport.authenticate('facebook')
);

loginRouter.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function (req, res) {
    req.user.tokens
    // Successful authentication, redirect home.
    res.redirect('/');
  });
/* loginRouter.get('/auth/facebook', passport.authenticate('facebook', { scope: ["profile", "email"] }));

loginRouter.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login'
  })); */

module.exports = loginRouter;
