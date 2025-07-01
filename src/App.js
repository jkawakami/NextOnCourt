import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import BasketballPage from './components/BasketballPage';
import VolleyballPage from './components/VolleyballPage';
import SportHeader from './components/SportHeader';

function App() {
  const [players, setPlayers] = useState([]);

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

  const endGame = () => {
    if (players.length >= 10) {
      const team1Players = players.slice(0, 5);
      const team2Players = players.slice(5, 10);
      const rest = players.slice(10);
      // Update games played for team1
      const updatedTeam1Players = team1Players.map(p => ({ ...p, gamesPlayed: p.gamesPlayed + 1 }));
      setPlayers([...team2Players, ...rest, ...updatedTeam1Players]);
    }
  };

  const reorderPlayers = (newPlayers) => {
    setPlayers(newPlayers);
  };

  // Always compute current teams from the first 10 players
  const currentTeams = players.length >= 10
    ? { team1: players.slice(0, 5), team2: players.slice(5, 10) }
    : { team1: [], team2: [] };

  // Determine if the first game has been played
  const firstGamePlayed = players.some(p => p.gamesPlayed > 0);

  return (
    <Router>
      <SportHeader />
      <main className="App-main">
        <div className="container">
          <Routes>
            <Route path="/" element={<BasketballPage />} />
            <Route path="/vball" element={<VolleyballPage />} />
          </Routes>
        </div>
      </main>
    </Router>
  );
}

export default App;
