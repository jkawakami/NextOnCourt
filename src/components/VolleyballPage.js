import React, { useState, useEffect } from 'react';
import TeamDisplay from './TeamDisplay';
import PlayerQueue from './PlayerQueue';

function VolleyballPage() {
  const [players, setPlayers] = useState([]);

  // Load players from localStorage on component mount
  useEffect(() => {
    const savedPlayers = localStorage.getItem('volleyballPlayers');
    if (savedPlayers) {
      setPlayers(JSON.parse(savedPlayers));
    }
  }, []);

  // Save players to localStorage whenever players state changes
  useEffect(() => {
    localStorage.setItem('volleyballPlayers', JSON.stringify(players));
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

  const endGame = () => {
    if (players.length >= 10) {
      const team1Players = players.slice(0, 5);
      const team2Players = players.slice(5, 10);
      const rest = players.slice(10);
      // Update games played for both teams
      const updatedTeam1Players = team1Players.map(p => ({ ...p, gamesPlayed: p.gamesPlayed + 1 }));
      const updatedTeam2Players = team2Players.map(p => ({ ...p, gamesPlayed: p.gamesPlayed + 1 }));
      setPlayers([...updatedTeam2Players, ...rest, ...updatedTeam1Players]);
    }
  };

  const reorderPlayers = (newPlayers) => {
    setPlayers(newPlayers);
  };

  // Always compute current teams from the first 10 players, even if fewer than 10
  const currentTeams = {
    team1: players.slice(0, 5),
    team2: players.slice(5, 10)
  };

  // Determine if the first game has been played
  const firstGamePlayed = players.some(p => p.gamesPlayed > 0);

  return (
    <>
      <div className="top-section">
        <TeamDisplay 
          teams={currentTeams}
          gameInProgress={true}
          onNextGame={endGame}
          nextGameDisabled={players.length < 10}
          players={players}
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
            firstGamePlayed={firstGamePlayed}
          />
        </div>
      </div>
    </>
  );
}

export default VolleyballPage; 