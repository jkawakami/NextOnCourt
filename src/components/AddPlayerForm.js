import React, { useState, forwardRef } from 'react';

const AddPlayerForm = forwardRef(({ onAddPlayer, minimal }, inputRef) => {
  const [playerName, setPlayerName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (playerName.trim()) {
      onAddPlayer(playerName);
      setPlayerName('');
    }
  };

  return (
    <div className={`add-player-form${minimal ? ' minimal' : ''}`}>
      {!minimal && <h3>Add Player</h3>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter player name"
            className="form-input"
            maxLength={30}
            ref={inputRef}
          />
          {!minimal && (
            <button type="submit" className="btn btn-success">
              Add
            </button>
          )}
        </div>
      </form>
    </div>
  );
});

AddPlayerForm.displayName = 'AddPlayerForm';

export default AddPlayerForm; 