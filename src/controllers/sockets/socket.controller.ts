import allowedOrigins from "../../constants/cors.constant";
import { Server } from "socket.io";

const initializeSocket = (server) => {
        const io = new Server(server, {
                cors: {
                        origin: allowedOrigins,
                        credentials: true,
                },
        });

        // global.onlineUsers = new Map();
        io.on("connection", (socket) => {
                console.log("new connection", socket.id);
                global.chatSocket = socket;

                const getUserRoom = (users: string[]) => users.sort().join("_");

                socket.on("join-users", (users: Array<string>) => {
                        const roomName = getUserRoom(users);
                        // console.log('joined', roomName)

                        socket.join(roomName);
                });

                socket.on("leave-room", (roomName) => {
                        socket.leave(roomName);
                });

                socket.on("send-msg", (data) => {
                        const { to, from } = data;

                        const roomName = getUserRoom([from, to]);
                        socket.broadcast.to(roomName).emit("msg-receive", data.message);
                });
        });
};

export default initializeSocket;
