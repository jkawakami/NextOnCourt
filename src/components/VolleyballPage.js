import React, { useState, useEffect } from 'react';
import TeamDisplayVolleyball from './TeamDisplayVolleyball';
import PlayerQueueVolleyball from './PlayerQueueVolleyball';

function VolleyballPage() {
  const [players, setPlayers] = useState([]);
  const isFirstLoad = React.useRef(true);

  // Load players from localStorage on component mount
  useEffect(() => {
    const savedPlayers = localStorage.getItem('volleyballPlayers');
    if (savedPlayers) {
      setPlayers(JSON.parse(savedPlayers));
    }
    console.log('localStorage on mount:', localStorage.getItem('volleyballPlayers'));
  }, []);

  // Save players to localStorage whenever players state changes
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    localStorage.setItem('volleyballPlayers', JSON.stringify(players));
  }, [players]);

  const addPlayer = (playerName) => {
    if (playerName.trim() && !players.find(p => p.name.toLowerCase() === playerName.toLowerCase())) {
      const newPlayer = {
        id: Date.now(),
        name: playerName.trim(),
        gamesPlayed: 0,
        team: null
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
    const team1Players = players.filter(p => p.team === 'team1');
    const team2Players = players.filter(p => p.team === 'team2');
    const team3Players = players.filter(p => p.team === 'team3');
    const team4Players = players.filter(p => p.team === 'team4');
    const rest = players.filter(p => !['team1','team2','team3','team4'].includes(p.team));
    if (team1Players.length === 0 && team2Players.length === 0 && team3Players.length === 0 && team4Players.length === 0) return;
    const updatedTeam1 = team1Players.map(p => ({ ...p, gamesPlayed: p.gamesPlayed + 1 }));
    const updatedTeam2 = team2Players.map(p => ({ ...p, gamesPlayed: p.gamesPlayed + 1 }));
    const updatedTeam3 = team3Players.map(p => ({ ...p, gamesPlayed: p.gamesPlayed + 1 }));
    const updatedTeam4 = team4Players.map(p => ({ ...p, gamesPlayed: p.gamesPlayed + 1 }));
    setPlayers([...updatedTeam3, ...updatedTeam4, ...rest, ...updatedTeam1, ...updatedTeam2]);
  };

  const reorderPlayers = (newPlayers) => {
    setPlayers(newPlayers);
  };

  // Handler to assign a player to a team
  const assignPlayerTeam = (playerId, team) => {
    setPlayers(players => players.map(p => p.id === playerId ? { ...p, team } : p));
  };

  // Compute teams based on player.team (4 teams)
  const currentTeams = {
    team1: players.filter(p => p.team === 'team1'),
    team2: players.filter(p => p.team === 'team2'),
    team3: players.filter(p => p.team === 'team3'),
    team4: players.filter(p => p.team === 'team4'),
  };

  // Determine if the first game has been played
  const firstGamePlayed = players.some(p => p.gamesPlayed > 0);

  const resetQueue = () => {
    setPlayers([]);
    localStorage.removeItem('volleyballPlayers');
  };

  return (
    <>
      <div className="top-section">
        <TeamDisplayVolleyball 
          teams={currentTeams}
          gameInProgress={true}
          onNextGame={endGame}
          nextGameDisabled={currentTeams.team1.length < 1 || currentTeams.team2.length < 1 || currentTeams.team3.length < 1 || currentTeams.team4.length < 1}
          players={players}
        />
      </div>
      <div className="bottom-section">
        <div className="left-panel">
          <PlayerQueueVolleyball 
            players={players}
            onRemovePlayer={removePlayer}
            onMoveUp={movePlayerUp}
            onMoveDown={movePlayerDown}
            onReorderPlayers={reorderPlayers}
            onAssignTeam={assignPlayerTeam}
            firstGamePlayed={firstGamePlayed}
            onResetQueue={resetQueue}
            showAddPlayerNextToTitle
            onAddPlayer={addPlayer}
          />
        </div>
      </div>
    </>
  );
}

export default VolleyballPage; 