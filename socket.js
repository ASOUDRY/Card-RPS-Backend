  import { GameSession } from './GameSession.js';
  
  // Store active game sessions
  const gameSessions = {};
  
  // Function to generate a unique session ID
  function generateSessionId() {
    return Math.random().toString(36).substring(2, 8);
  }
  
  export function setupSocketHandlers(io, socket) {
    console.log('A user connected');
  
    // Create a new game session
    socket.on('createSession', () => {
      const sessionId = generateSessionId();
      const newSession = new GameSession(sessionId, socket.id);
      gameSessions[sessionId] = newSession;
      socket.join(sessionId);
  
      socket.emit('createdSession', sessionId);
    });
  
    // Join an existing game session
    socket.on('joinSession', (sessionId, callback) => {
      if (gameSessions[sessionId]) {
        socket.join(sessionId);
        gameSessions[sessionId].addPlayer(socket.id);
        io.to(sessionId).emit('ready', gameSessions[sessionId]);
        callback({ status: 'success', sessionData: gameSessions[sessionId] });
      } else {
        callback({ status: 'error', message: `Session ${sessionId} does not exist` });
      }
    });
  
    socket.on('c', (sessionId, callback) => {
      if (sessionId != false) {
        const count = gameSessions[sessionId].getPlayerCount();
        if (count > 1) {
          callback({ status: "success", switch: true, state: gameSessions[sessionId] });
        } else {
          callback({ status: "success", switch: false, state: gameSessions[sessionId] });
        }
      } else {
        callback({ status: "failure" });
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
  }