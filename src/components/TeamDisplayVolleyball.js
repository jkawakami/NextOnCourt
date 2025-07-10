import React, { useState, useRef } from 'react';

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60).toString();
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const TeamDisplayVolleyball = ({ teams, gameInProgress, onNextGame, nextGameDisabled, players, teamCount, teamNames, setTeamName, removeTeamByKey, onDropPlayerToTeam }) => {
  // Timer state
  const [duration, setDuration] = useState(420); // 7 minutes default
  const [timeLeft, setTimeLeft] = useState(420);
  const [isRunning, setIsRunning] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const timerRef = useRef(null);
  const [showTimeUp, setShowTimeUp] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [dragOverTeam, setDragOverTeam] = useState(null);

  React.useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (!isRunning) {
      clearTimeout(timerRef.current);
    }
    if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setShowTimeUp(true);
    }
    return () => clearTimeout(timerRef.current);
  }, [isRunning, timeLeft]);

  React.useEffect(() => {
    setTimeLeft(duration);
    setIsRunning(false);
    setEditMode(false);
  }, [teams.team1, teams.team2, teams.team3, teams.team4]);

  const handleStartPause = () => {
    if (timeLeft > 0) setIsRunning((r) => !r);
  };
  const handleReset = () => {
    setTimeLeft(duration);
    setIsRunning(false);
  };
  const handleEdit = () => {
    setEditMode(true);
    setIsRunning(false);
  };
  const handleEditSave = (e) => {
    e.preventDefault();
    let mins = parseInt(e.target.minutes.value, 10) || 0;
    let secs = parseInt(e.target.seconds.value, 10) || 0;
    let total = Math.max(1, mins * 60 + secs);
    setDuration(total);
    setTimeLeft(total);
    setEditMode(false);
  };

  // Compute next two teams (players 6-15, wrap around if needed)
  let nextTeam1 = [];
  let nextTeam2 = [];
  if (players && players.length > 5) {
    const queue = [...players.slice(5), ...players.slice(0, 5)];
    nextTeam1 = queue.slice(0, 5);
    nextTeam2 = queue.slice(5, 10);
  }

  const handleCloseTimeUp = () => {
    setShowTimeUp(false);
    setTimeLeft(duration);
    setIsRunning(false);
  };

  const handleStartNextGame = () => {
    setShowTimeUp(false);
    if (onNextGame) onNextGame();
    setTimeLeft(duration);
    setIsRunning(false);
  };

  return (
    <div className="team-display">
      {showTimeUp && (
        <div className="timeup-overlay" style={{position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.45)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div className="timeup-popup" style={{background: 'white', borderRadius: 12, padding: '2rem', minWidth: 600, maxWidth: 900, width: '90vw', boxShadow: '0 4px 32px rgba(0,0,0,0.18)', textAlign: 'center', overflow: 'visible'}}>
            <h3 style={{marginBottom: '0.5rem'}}>Time's Up!</h3>
            <p style={{marginBottom: '1.5rem'}}>The game is over. Next Up!</p>
            {(nextTeam1.length > 0 || nextTeam2.length > 0) && (
              <div className="teams-container" style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start', gap: '2.5rem', margin: '0 auto', width: '100%'}}>
                <div className="team team1" style={{flex: '1 1 300px', minWidth: 220, maxWidth: 350, border: '2px solid #38a169', borderRadius: 10, padding: '1rem'}}>
                  <h5 style={{marginBottom: '0.5rem', color: '#222', fontWeight: 700}}>Team 1</h5>
                  <div className="team-players vertical" style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center'}}>
                    {nextTeam1.map((player) => (
                      <div key={player.id} className="team-player" style={{background: '#f8f9fa', borderRadius: 6, padding: '0.5rem 1.2rem', fontWeight: 600, fontSize: '1.1rem', minWidth: 60, textAlign: 'center', border: '1.5px solid #38a169', width: '100%'}}>
                        <span className="player-name">{player.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="vs-divider" style={{alignSelf: 'center'}}><span style={{fontWeight: 700, fontSize: '1.3rem', background: '#f3f3f3', borderRadius: '50%', padding: '0.5rem 1rem', color: '#888'}}>VS</span></div>
                <div className="team team2" style={{flex: '1 1 300px', minWidth: 220, maxWidth: 350, border: '2px solid #e53e3e', borderRadius: 10, padding: '1rem'}}>
                  <h5 style={{marginBottom: '0.5rem', color: '#222', fontWeight: 700}}>Team 2</h5>
                  <div className="team-players vertical" style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center'}}>
                    {nextTeam2.map((player) => (
                      <div key={player.id} className="team-player" style={{background: '#f8f9fa', borderRadius: 6, padding: '0.5rem 1.2rem', fontWeight: 600, fontSize: '1.1rem', minWidth: 60, textAlign: 'center', border: '1.5px solid #e53e3e', width: '100%'}}>
                        <span className="player-name">{player.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <button className="btn btn-primary" onClick={handleStartNextGame} style={{marginTop: '1rem', fontSize: '1.1rem', padding: '0.7rem 2.2rem'}}>Start Next Game</button>
          </div>
        </div>
      )}
      <div className="timer-row">
        {editMode ? (
          <form className="timer-edit-form" onSubmit={handleEditSave}>
            <input
              type="number"
              name="minutes"
              min="0"
              max="59"
              defaultValue={Math.floor(duration / 60)}
              className="timer-input"
            />
            <span>:</span>
            <input
              type="number"
              name="seconds"
              min="0"
              max="59"
              defaultValue={duration % 60}
              className="timer-input"
            />
            <button type="submit" className="btn btn-success btn-small">Save</button>
            <button type="button" className="btn btn-secondary btn-small" onClick={() => setEditMode(false)}>Cancel</button>
          </form>
        ) : (
          <div className="timer-display">
            <span className="timer-time">{formatTime(timeLeft)}</span>
            <button className="btn btn-small btn-secondary" onClick={handleEdit} title="Edit timer">✎</button>
            <button className="btn btn-small btn-primary" onClick={handleStartPause}>
              {isRunning ? 'Pause' : 'Start'}
            </button>
            <button className="btn btn-small btn-danger" onClick={handleReset}>Reset</button>
            <button
              className="btn btn-small btn-primary"
              onClick={onNextGame}
              disabled={nextGameDisabled}
              style={{ marginLeft: '0.5rem' }}
            >
              Next Game
            </button>
          </div>
        )}
      </div>
      <div className="teams-container" style={{display: 'flex', flexWrap: 'wrap', gap: '2.5vw', justifyContent: 'center', alignItems: 'flex-start', width: '100%', maxWidth: '100vw'}}>
        {Array.from({ length: teamCount }).map((_, i) => {
          const teamKey = `team${i + 1}`;
          const borderColors = ['#38a169', '#e53e3e', '#3182ce', '#d69e2e', '#805ad5', '#319795', '#ed8936', '#718096'];
          const borderColor = borderColors[i % borderColors.length];
          const isDragOver = dragOverTeam === teamKey;
          return (
            <div
              key={teamKey}
              className={`team ${teamKey}`}
              style={{
                background: isDragOver ? '#e6fffa' : 'rgba(255,255,255,0.92)',
                border: `2px solid ${borderColor}`,
                borderRadius: 10,
                padding: '0.5rem 1.2rem',
                minWidth: 120,
                flex: '1 1 300px',
                maxWidth: 350,
                boxShadow: isDragOver ? `0 0 0 3px ${borderColor}55` : undefined,
                transition: 'background 0.15s, box-shadow 0.15s',
              }}
              onDragOver={e => { e.preventDefault(); setDragOverTeam(teamKey); }}
              onDragLeave={e => { setDragOverTeam(null); }}
              onDrop={e => {
                e.preventDefault();
                setDragOverTeam(null);
                const playerId = e.dataTransfer.getData('playerId');
                if (playerId && typeof window.onDropPlayerToTeam === 'function') {
                  window.onDropPlayerToTeam(playerId, teamKey);
                } else if (playerId && typeof onDropPlayerToTeam === 'function') {
                  onDropPlayerToTeam(playerId, teamKey);
                }
              }}
            >
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 4}}>
                {editingTeam === teamKey ? (
                  <form onSubmit={e => { e.preventDefault(); setTeamName(teamKey, editValue.trim() || teamNames[teamKey]); setEditingTeam(null); }} style={{display: 'flex', alignItems: 'center', gap: 4}}>
                    <input
                      type="text"
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      style={{ fontSize: '1.1rem', fontWeight: 600, borderRadius: 6, border: `1.5px solid ${borderColor}`, padding: '2px 8px', minWidth: 60 }}
                      maxLength={30}
                      autoFocus
                    />
                    <button type="submit" style={{ background: borderColor, color: '#fff', border: 'none', borderRadius: 4, padding: '2px 10px', fontWeight: 600, fontSize: '1rem', marginLeft: 2 }}>Save</button>
                    <button type="button" style={{ background: '#eee', color: '#444', border: 'none', borderRadius: 4, padding: '2px 10px', fontWeight: 600, fontSize: '1rem', marginLeft: 2 }} onClick={() => setEditingTeam(null)}>Cancel</button>
                  </form>
                ) : (
                  <>
                    <h4 style={{textAlign: 'center', margin: 0}}>{teamNames[teamKey] || `Team ${i + 1}`}</h4>
                    <button
                      style={{ marginLeft: 6, background: 'none', border: 'none', color: borderColor, fontSize: '1.1rem', cursor: 'pointer', padding: 0 }}
                      title="Edit team name"
                      onClick={() => { setEditingTeam(teamKey); setEditValue(teamNames[teamKey] || `Team ${i + 1}`); }}
                    >
                      ✎
                    </button>
                    <button
                      style={{ marginLeft: 6, background: 'none', border: 'none', color: '#e53e3e', fontSize: '1.1rem', cursor: teamCount <= 1 ? 'not-allowed' : 'pointer', padding: 0, opacity: teamCount <= 1 ? 0.5 : 1 }}
                      title="Delete team"
                      onClick={() => removeTeamByKey(teamKey)}
                      disabled={teamCount <= 1}
                    >
                      🗑️
                    </button>
                  </>
                )}
              </div>
              <div className="team-players vertical" style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center'}}>
                {teams[teamKey].map((player) => (
                  <div
                    key={player.id}
                    className="team-player"
                    style={{
                      background: '#f8f9fa',
                      borderRadius: 6,
                      padding: '0.5rem 1.2rem',
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      minWidth: 60,
                      textAlign: 'center',
                      border: `1.5px solid ${borderColor}`,
                      width: '100%',
                      cursor: 'grab',
                      userSelect: 'none',
                    }}
                    draggable
                    onDragStart={e => {
                      e.dataTransfer.effectAllowed = 'move';
                      e.dataTransfer.setData('playerId', player.id);
                    }}
                  >
                    <span className="player-name">{player.name}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamDisplayVolleyball; 