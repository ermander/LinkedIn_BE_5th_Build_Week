const MessageModel = require("./schema")

const addMessage = async (text, sender, reciever) => {
    try {
        const newMessage = new MessageModel({
            text: text, 
            sender,
            reciever
        })
        const savedMessage = await newMessage.save()
        return savedMessage        
    } catch (error) {
        console.log(error)
    }
}

module.exports = { addMessage }