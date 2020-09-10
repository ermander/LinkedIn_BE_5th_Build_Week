const MessageModel = require("./schema")

const saveMessages = async(from, to, text) => {
    try {
        const newMessage = new MessageModel({
            from: from,
            to: to,
            text: text
        })

        const savedMessage = await newMessage.save()
        return savedMessage        
    } catch (error) {
        console.log(error)        
    }
}

module.exports = { saveMessages }