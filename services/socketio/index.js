const express = require("express")
const messagesRouter = express.Router()
const UserModel = require("../registration/schema")

messagesRouter.put("/", async(req, res, next) => {
    try {
        const user = await UserModel.findOneAndUpdate( fromToken, fromSocketID, {
            fromToken: fromToken,
            fromSocketID: fromSocketID
        })
        
    } catch (error) {
        console.log(error)        
    }
} )

module.exports = messagesRouter