const { Schema, model } = require("mongoose");
const UserModel = require("../registration/schema");

const commentSchema = new Schema(
  {
    comment: {
      type: String,
    },
    username: String,
    postId: String,
    user: UserModel.schema,
  },
  { timestamps: true }
);

const commentModel = model("comment", commentSchema);
module.exports = commentModel;
