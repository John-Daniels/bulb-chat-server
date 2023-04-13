import { createServer } from 'http'
import app from './app'
import initializeSocket from './controllers/sockets/socket.controller';

const port = process.env.PORT || 5000;
const server = createServer(app)

initializeSocket(server)

server.listen(port, () => console.log('\x1b[32m%s\x1b[0m', `Bulb chat API is Connected on port ${port}`))

