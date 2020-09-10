const MessageModel = require("./schema")
const { findOne } = require("../posts/schema")

const checkUser = async (fromToken, fromSocketID) => {
    try {
        const user = await findOne({
            fromToken: fromToken,
            fromSocketID: fromSocketID
        })
        if(user){
            return user
        }      
    } catch (error) {
        console.log(error)
    }
}

module.exports = { checkUser }