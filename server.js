import express from 'express';
import { createServer } from 'http';
// import { fileURLToPath } from 'url';
// import { dirname, join } from 'path';
import { Server } from 'socket.io';
import { setupSocketHandlers } from './socket.js';

// Create Express app and HTTP server
const app = express();

const server = createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000"
  }
});

// Get the directory name of the current module file
// const __dirname = dirname(fileURLToPath(import.meta.url));

// Serve static files from the 'public' directory
// app.use(express.static(join(__dirname, 'public')));

// Route for serving the HTML file
// app.get('/', (req, res) => {
//   res.sendFile(join(__dirname, 'game.html'));
// });

// Socket.IO event listeners
io.on('connection', (socket) => {
  setupSocketHandlers(io, socket);
});

// Start the server
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});