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
            style={{
              background: '#f8fafc',
              border: '2px solid #38a169',
              color: '#222',
              fontWeight: 500,
              borderRadius: 8,
              padding: '7px 12px',
              outline: 'none',
              transition: 'box-shadow 0.2s',
            }}
            onFocus={e => e.target.style.boxShadow = '0 0 0 2px #38a16944'}
            onBlur={e => e.target.style.boxShadow = 'none'}
          />
          {minimal ? (
            <button type="submit" className="btn btn-success btn-small" style={{marginLeft: 6, padding: '2px 10px', fontSize: '1em', lineHeight: 1}} title="Add player">
              Add
            </button>
          ) : (
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