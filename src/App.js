import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import PlayerQueue from './components/PlayerQueue';
import TeamDisplay from './components/TeamDisplay';
import AddPlayerForm from './components/AddPlayerForm';
import BasketballPage from './components/BasketballPage';
import VolleyballPage from './components/VolleyballPage';

function SportHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = React.useState(false);
  const currentSport = location.pathname === '/vball' ? '🏐' : '🏀';

  const handleSelect = (sport) => {
    setOpen(false);
    if (sport === '🏀') navigate('/');
    else if (sport === '🏐') navigate('/vball');
  };

  React.useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <header className="App-header">
      <div className="sport-header-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
        <span
          className="sport-emoji-dropdown"
          style={{ cursor: 'pointer', fontSize: '2rem', marginRight: 10, userSelect: 'none', verticalAlign: 'middle' }}
          onClick={e => { e.stopPropagation(); setOpen((o) => !o); }}
          tabIndex={0}
        >
          {currentSport} <span style={{ fontSize: '1.1rem', verticalAlign: 'middle' }}>▼</span>
        </span>
        {open && (
          <div className="sport-emoji-menu" style={{ position: 'absolute', left: 0, top: '110%', background: 'white', border: '1px solid #e1e5e9', borderRadius: 8, boxShadow: '0 2px 16px rgba(0,0,0,0.18)', zIndex: 9999, minWidth: 80 }}>
            <button className="sport-emoji-item" style={{ fontSize: '1.5rem', padding: '0.5rem 1.2rem', background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }} onClick={() => handleSelect('🏀')}>🏀 Basketball</button>
            <button className="sport-emoji-item" style={{ fontSize: '1.5rem', padding: '0.5rem 1.2rem', background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }} onClick={() => handleSelect('🏐')}>🏐 Volleyball</button>
          </div>
        )}
      </div>
      <span style={{ fontWeight: 700, fontSize: '1.8rem', verticalAlign: 'middle' }}>Next On Court</span>
    </header>
  );
}

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
