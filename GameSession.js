export class GameSession {
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
  