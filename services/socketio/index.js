const express = require("express")
const messagesRoute = express.Router()
const MessageModel = require("./schema")

messagesRoute.get("/", async(req, res) => {
    try {
        const messages = await MessageModel.find()
        res.send(messages)        
    } catch (error) {
        console.log(error)        
    }
})

module.exports = messagesRoute