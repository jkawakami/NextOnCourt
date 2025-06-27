import React from 'react';

const TeamDisplay = ({ teams, gameInProgress }) => {
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
      <h3>Current Game</h3>
      <div className="teams-container">
        <div className="team team1">
          <h4>Team 1 (White)</h4>
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
          <h4>Team 2 (Dark)</h4>
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