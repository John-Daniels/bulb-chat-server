import { Server } from "socket.io";


const initializeSocket = (server) => {
        const io = new Server(server, {
                cors: {
                        origin: ['http://localhost:3000'],
                        credentials: true,
                },
        });

        global.onlineUsers = new Map();
        io.on("connection", (socket) => {


                console.log('new connection', socket.id)
                global.chatSocket = socket;
                socket.on('add-user', (userId) => {
                        global.onlineUsers.set(userId, socket.id)
                        console.log(socket.id, 'join')
                        socket.join(socket.id)

                        setInterval(() => {

                                io.to(socket.id).emit('msg-receive', 'hello from server')

                        }, 2000)
                })

                socket.on('send-msg', (data) => {
                        const sendUserSocket = global.onlineUsers.get(data.to)
                        console.log(data, 'send-msg', sendUserSocket)
                        // if (sendUserSocket) {
                        io.to(sendUserSocket).emit('msg-receive', data.message)
                        // }
                })
        });
}

export default initializeSocket