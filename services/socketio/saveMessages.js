const MessageModel = require("./schema")

const saveMessages = async(senderId, recieverID, text) => {
    try {
        const newMessage = new MessageModel({
            from: senderId,
            to: recieverID,
            text: text
        })

        const savedMessage = await newMessage.save()
        return savedMessage        
    } catch (error) {
        console.log(error)        
    }
}

module.exports = { saveMessages }