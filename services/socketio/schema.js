const { Schema } = require("mongoose")
const mongoose = require("mongoose")

const MessageSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    sender: {
      type: String,
      required: true
    },
    reciever: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
)

const MessageModel = mongoose.model("Message", MessageSchema)

module.exports = MessageModel