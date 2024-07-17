import express from 'express';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Server } from 'socket.io';

// Create Express app and HTTP server
const app = express();

const server = createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000"
  }
});

// 

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
  console.log('A user connected');
  

  // Create a new game session
  socket.on('createSession', () => {
    // console.log("The socket is " + socket.id);
    const sessionId = generateSessionId();
    const newSession = new GameSession(sessionId, socket.id);
    gameSessions[sessionId] = newSession;
    socket.join(sessionId);
    // console.log(`New session created with ID: ${sessionId}`);
    socket.emit('createdSession', sessionId)
  });

  // Join an existing game session
  socket.on('joinSession', (sessionId, callback) => {
    // console.log("Is this sent?")
    if (gameSessions[sessionId]) {
      socket.join(sessionId);
      gameSessions[sessionId].addPlayer(socket.id);
      io.to(sessionId).emit('ready', gameSessions[sessionId]);
      // socket.to(sessionId).emit('ready', gameSessions[sessionId]);
      callback({ status: 'success', sessionData: gameSessions[sessionId] });
    } else {
      callback({ status: 'error', message: `Session ${sessionId} does not exist` });
    }
  });


  socket.on('c', (sessionId, callback) => {
    // console.log("Receiving C");
    // console.log(sessionId);
    // console.log(gameSessions[sessionId].getPlayerCount());
    // console.log(sessionId);
    if (sessionId != false ) {
      const count = gameSessions[sessionId].getPlayerCount();
      if (count > 1) {
        callback({status: "success", switch: true, state: gameSessions[sessionId]})
      }
      else {
        callback({status: "success", switch: false, state: gameSessions[sessionId]})
      }  
    }
    else {
      callback({status: "failure"})
    }
  });

  // Handle chat messages
  socket.on('react', (msg) => {
    console.log(msg);
    io.emit('react', "message from server");
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });

});

// Class representing a game session
class GameSession {
  constructor(id, player) {
    this.id = id;
    this.players = [player];
  }
  // Add a player to the session
  addPlayer(player) {
    this.players.push(player);
  }
  // Remove a player from the session
  removePlayer(player) {
    const index = this.players.indexOf(player);
    if (index !== -1) {
      this.players.splice(index, 1);
    }
  }
  // Get the number of players in the session
  getPlayerCount() {
    return this.players.length;
  }
}

// Store active game sessions
const gameSessions = {};

// function checkSession(sessionId) {
//   if 
// }

// Function to generate a unique session ID
function generateSessionId() {
  return Math.random().toString(36).substring(2, 8);
}

// Start the server
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});