import React, { useState, useEffect } from 'react';
import TeamDisplayVolleyball from './TeamDisplayVolleyball';
import PlayerQueueVolleyball from './PlayerQueueVolleyball';

function VolleyballPage() {
  const [players, setPlayers] = useState([]);
  const isFirstLoad = React.useRef(true);
  const [addError, setAddError] = useState('');
  const [teamCount, setTeamCount] = useState(4);
  const [teamNames, setTeamNames] = useState({ team1: 'Team 1', team2: 'Team 2', team3: 'Team 3', team4: 'Team 4' });
  const [removeTeamDropdownOpen, setRemoveTeamDropdownOpen] = useState(false);
  const [teamToRemove, setTeamToRemove] = useState('');

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
    if (!playerName.trim()) return;
    if (players.find(p => p.name.toLowerCase() === playerName.trim().toLowerCase())) {
      setAddError('Player names must be unique.');
      setTimeout(() => setAddError(''), 2500);
      return;
    }
    const newPlayer = {
      id: Date.now(),
      name: playerName.trim(),
      gamesPlayed: 0,
      team: null
    };
    setPlayers([...players, newPlayer]);
    setAddError('');
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

  // Compute teams dynamically
  const currentTeams = {};
  for (let i = 1; i <= teamCount; i++) {
    currentTeams[`team${i}`] = players.filter(p => p.team === `team${i}`);
  }

  // Determine if the first game has been played
  const firstGamePlayed = players.some(p => p.gamesPlayed > 0);

  const resetQueue = () => {
    setPlayers([]);
    localStorage.removeItem('volleyballPlayers');
  };

  const handleAddTeam = () => {
    setTeamCount((count) => count + 1);
    setTeamNames(names => {
      const newKey = `team${teamCount + 1}`;
      return { ...names, [newKey]: `Team ${teamCount + 1}` };
    });
  };

  const removeTeamByKey = (teamKey) => {
    if (!teamKey) return;
    if (teamCount <= 1) return;
    setPlayers(players => players.map(p => p.team === teamKey ? { ...p, team: null } : p));
    setTeamCount(count => count - 1);
    setTeamNames(names => {
      const updated = { ...names };
      delete updated[teamKey];
      return updated;
    });
    if (teamToRemove === teamKey) setTeamToRemove('');
    setRemoveTeamDropdownOpen(false);
  };

  const setTeamName = (teamKey, newName) => {
    setTeamNames(names => ({ ...names, [teamKey]: newName }));
  };

  return (
    <>
      <div className="top-section" style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: 16, right: 24, zIndex: 10, display: 'flex', gap: 12 }}>
          <button
            style={{
              background: '#38a169',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '8px 20px',
              fontWeight: 600,
              fontSize: '1rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onClick={handleAddTeam}
          >
            Add Team
          </button>
          <div style={{ position: 'relative' }}>
            <button
              style={{
                background: '#e53e3e',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '8px 20px',
                fontWeight: 600,
                fontSize: '1rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                cursor: teamCount <= 1 ? 'not-allowed' : 'pointer',
                opacity: teamCount <= 1 ? 0.6 : 1,
              }}
              onClick={() => setRemoveTeamDropdownOpen(open => !open)}
              disabled={teamCount <= 1}
            >
              Remove Team
            </button>
            {removeTeamDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '110%',
                right: 0,
                background: '#fff',
                border: '1.5px solid #e2e8f0',
                borderRadius: 8,
                boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
                padding: 12,
                minWidth: 160,
                zIndex: 100,
              }}>
                <select
                  value={teamToRemove}
                  onChange={e => setTeamToRemove(e.target.value)}
                  style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1.5px solid #e2e8f0', marginBottom: 10 }}
                >
                  <option value="">Select Team</option>
                  {Array.from({ length: teamCount }).map((_, i) => (
                    <option key={`team${i+1}`} value={`team${i+1}`}>{`Team ${i+1}`}</option>
                  ))}
                </select>
                <button
                  style={{
                    background: '#e53e3e',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '6px 16px',
                    fontWeight: 600,
                    fontSize: '1rem',
                    width: '100%',
                    cursor: !teamToRemove ? 'not-allowed' : 'pointer',
                    opacity: !teamToRemove ? 0.6 : 1,
                  }}
                  onClick={() => removeTeamByKey(teamToRemove)}
                  disabled={!teamToRemove}
                >
                  Confirm Remove
                </button>
              </div>
            )}
          </div>
        </div>
        <TeamDisplayVolleyball 
          teams={currentTeams}
          teamCount={teamCount}
          teamNames={teamNames}
          setTeamName={setTeamName}
          removeTeamByKey={removeTeamByKey}
          gameInProgress={true}
          onNextGame={endGame}
          nextGameDisabled={Object.values(currentTeams).some(team => team.length < 1)}
          players={players}
        />
      </div>
      <div className="bottom-section">
        <div className="left-panel">
          {addError && (
            <div style={{ color: 'red', marginBottom: 8, fontWeight: 500 }}>{addError}</div>
          )}
          <PlayerQueueVolleyball 
            players={players}
            onRemovePlayer={removePlayer}
            onMoveUp={movePlayerUp}
            onMoveDown={movePlayerDown}
            onReorderPlayers={reorderPlayers}
            onAssignTeam={assignPlayerTeam}
            teamCount={teamCount}
            teamNames={teamNames}
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