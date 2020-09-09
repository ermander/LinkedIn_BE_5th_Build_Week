const { Schema, model } = require("mongoose");
const UserModel = require("../registration/schema");

const postSchema = new Schema(
  {
    text: {
      type: String,
    },
    username: String,
    image: {
      type: Buffer,
    },
    user: UserModel.schema,
  },
  { timestamps: true }
);

const postModel = model("post", postSchema);
module.exports = postModel;
