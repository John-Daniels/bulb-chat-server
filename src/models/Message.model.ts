import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
        message: {
                text: String,
        },
        users: Array,
        to: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "users",
                required: true
        },
        sender: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "users",
                required: true
        },
}, {
        timestamps: true
})

const Message = mongoose.model('messages', messageSchema)
export default Message