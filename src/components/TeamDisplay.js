import React, { useState, useRef } from 'react';

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60).toString();
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const TeamDisplay = ({ teams, gameInProgress, onNextGame, nextGameDisabled, players }) => {
  // Timer state
  const [duration, setDuration] = useState(420); // 7 minutes default
  const [timeLeft, setTimeLeft] = useState(420);
  const [isRunning, setIsRunning] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const timerRef = useRef(null);
  const [showTimeUp, setShowTimeUp] = useState(false);

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

  // Reset timer when a new game starts
  React.useEffect(() => {
    setTimeLeft(duration);
    setIsRunning(false);
    setEditMode(false);
  }, [teams.team1, teams.team2]);

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
    // Create a queue that wraps around
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
      <div className="teams-container">
        <div className="team team1">
          <h4>Team 1</h4>
          <div className="team-players horizontal">
            {teams.team1.map((player) => (
              <div key={player.id} className="team-player">
                <span className="player-name">{player.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="vs-divider">
          <span>VS</span>
        </div>
        
        <div className="team team2">
          <h4>Team 2</h4>
          <div className="team-players horizontal">
            {teams.team2.map((player) => (
              <div key={player.id} className="team-player">
                <span className="player-name">{player.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDisplay; 