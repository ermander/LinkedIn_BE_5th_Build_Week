const { Schema, model } = require("mongoose")

const MessageSchema = new Schema(
  {
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
)

const MessageModel = model("Message", MessageSchema)

module.exports = MessageModel