import React, { useState, useEffect } from 'react';
import './App.css';
import PlayerQueue from './components/PlayerQueue';
import TeamDisplay from './components/TeamDisplay';
import AddPlayerForm from './components/AddPlayerForm';

function App() {
  const [players, setPlayers] = useState([]);
  const [currentTeams, setCurrentTeams] = useState({ team1: [], team2: [] });
  const [gameInProgress, setGameInProgress] = useState(false);

  // Load players from localStorage on component mount
  useEffect(() => {
    const savedPlayers = localStorage.getItem('basketballPlayers');
    if (savedPlayers) {
      setPlayers(JSON.parse(savedPlayers));
    }
  }, []);

  // Save players to localStorage whenever players state changes
  useEffect(() => {
    localStorage.setItem('basketballPlayers', JSON.stringify(players));
  }, [players]);

  const addPlayer = (playerName) => {
    if (playerName.trim() && !players.find(p => p.name.toLowerCase() === playerName.toLowerCase())) {
      const newPlayer = {
        id: Date.now(),
        name: playerName.trim(),
        gamesPlayed: 0
      };
      setPlayers([...players, newPlayer]);
    }
  };

  const removePlayer = (playerId) => {
    setPlayers(players.filter(p => p.id !== playerId));
  };

  const movePlayerUp = (playerId) => {
    const playerIndex = players.findIndex(p => p.id === playerId);
    if (playerIndex > 0) {
      const newPlayers = [...players];
      [newPlayers[playerIndex], newPlayers[playerIndex - 1]] = [newPlayers[playerIndex - 1], newPlayers[playerIndex]];
      setPlayers(newPlayers);
    }
  };

  const movePlayerDown = (playerId) => {
    const playerIndex = players.findIndex(p => p.id === playerId);
    if (playerIndex < players.length - 1) {
      const newPlayers = [...players];
      [newPlayers[playerIndex], newPlayers[playerIndex + 1]] = [newPlayers[playerIndex + 1], newPlayers[playerIndex]];
      setPlayers(newPlayers);
    }
  };

  const startGame = () => {
    if (players.length >= 10) {
      // Take the first 10 players in queue order
      const team1 = players.slice(0, 5);
      const team2 = players.slice(5, 10);
      setCurrentTeams({ team1, team2 });
      setGameInProgress(true);
    }
  };

  const endGame = () => {
    if (gameInProgress) {
      // Only move the first 5 players (Team 1) to the back of the queue
      const team1Players = currentTeams.team1;
      const remainingPlayers = players.filter(p => !team1Players.find(tp => tp.id === p.id));
      
      // Update games played count for Team 1 players who just played
      const updatedRemainingPlayers = remainingPlayers.map(p => ({
        ...p,
        gamesPlayed: p.gamesPlayed
      }));
      
      const updatedTeam1Players = team1Players.map(p => ({
        ...p,
        gamesPlayed: p.gamesPlayed + 1
      }));

      // Move Team 1 to the back of the queue, keep Team 2 in their current positions
      setPlayers([...updatedRemainingPlayers, ...updatedTeam1Players]);
      
      // Clear the teams display
      setCurrentTeams({ team1: [], team2: [] });
      setGameInProgress(false);
    }
  };

  const reorderPlayers = (newPlayers) => {
    setPlayers(newPlayers);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🏀 Next On Court</h1>
      </header>
      
      <main className="App-main">
        <div className="container">
          <div className="top-section">
            <TeamDisplay 
              teams={currentTeams}
              gameInProgress={gameInProgress}
            />
          </div>
          
          <div className="bottom-section">
            <div className="left-panel">
              <PlayerQueue 
                players={players}
                onRemovePlayer={removePlayer}
                onMoveUp={movePlayerUp}
                onMoveDown={movePlayerDown}
                onReorderPlayers={reorderPlayers}
              />
              <div className="actions">
                <AddPlayerForm onAddPlayer={addPlayer} />
                <div className="game-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={startGame}
                    disabled={players.length < 10 || gameInProgress}
                  >
                    Start Game
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={endGame}
                    disabled={!gameInProgress}
                  >
                    End Game
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
