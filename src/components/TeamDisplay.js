import React, { useState, useRef } from 'react';

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60).toString();
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const TeamDisplay = ({ teams, gameInProgress }) => {
  // Timer state
  const [duration, setDuration] = useState(420); // 7 minutes default
  const [timeLeft, setTimeLeft] = useState(420);
  const [isRunning, setIsRunning] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const timerRef = useRef(null);

  React.useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (!isRunning) {
      clearTimeout(timerRef.current);
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

  if (!gameInProgress) {
    return (
      <div className="team-display">
        <h3>Current Game</h3>
        <div className="no-game">
          <p>No game in progress</p>
          <p>Add at least 10 players and click "Start Game" to begin</p>
        </div>
      </div>
    );
  }

  return (
    <div className="team-display">
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