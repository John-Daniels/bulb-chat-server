import respond from "../utils/respond";
import Message from "../models/Message.model";

export const addMessage = async (req, res, next) => {
        try {
                const { from, to, message } = req.body;
                const data = await Message.create({
                        message: { text: message },
                        users: [from, to],
                        sender: from,
                        to,
                });

                await data.save();
                respond(res, 201, "Message sent successfully");
        } catch (e) {
                next(e);
        }
};

export const getAllMessage = async (req, res, next) => {
        const { _id: from } = req.user;
        const to = req.params.userId;

        if (!to) return respond(res, 400, "pls provide a valid userId");

        try {
                const messages = await Message.find({
                        $or: [
                                { to, sender: from },
                                { to: from, sender: to },
                        ],
                })
                        .sort({ createdAt: 1 })
                        .limit(20);

                const sanitizeMessages = messages.map((msg: any) => ({
                        fromSelf: msg.sender == from,
                        message: msg.message.text,
                }));

                respond(res, 200, "fetched messages", sanitizeMessages);
        } catch (e) {
                next(e);
        }
};
