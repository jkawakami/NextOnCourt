import React, { useState, useEffect, useRef } from 'react';
import AddPlayerForm from './AddPlayerForm';

const PlayerQueueVolleyball = ({ players, onRemovePlayer, onMoveUp, onMoveDown, onReorderPlayers, firstGamePlayed, onAssignTeam, onResetQueue, showAddPlayerNextToTitle, onAddPlayer }) => {
  const [draggedPlayer, setDraggedPlayer] = useState(null);
  const [dragOverPlayer, setDragOverPlayer] = useState(null);
  const [playerToRemove, setPlayerToRemove] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [editName, setEditName] = useState('');
  const menuRefs = useRef({});
  const addPlayerInputRef = useRef(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    if (menuOpen !== null) {
      const handleClick = (e) => {
        const menuNode = menuRefs.current[menuOpen];
        if (menuNode && !menuNode.contains(e.target)) {
          setMenuOpen(null);
          setEditingPlayer(null);
        }
      };
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [menuOpen]);

  const getCompactMode = () => {
    if (players.length >= 40) return 'very-compact';
    if (players.length >= 20) return 'compact';
    return 'normal';
  };
  const compactMode = getCompactMode();

  const groupPlayers = (players) => {
    const groups = [];
    const groupSize = players.length >= 20 ? 10 : 5;
    for (let i = 0; i < players.length; i += groupSize) {
      const group = players.slice(i, i + groupSize);
      groups.push({
        players: group,
        groupNumber: Math.floor(i / groupSize) + 1
      });
    }
    return groups;
  };
  const playerGroups = groupPlayers(players);

  const handleDragStart = (e, player) => {
    setDraggedPlayer(player);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', player.id);
  };
  const handleDragOver = (e, player) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverPlayer(player);
  };
  const handleDragLeave = () => {
    setDragOverPlayer(null);
  };
  const handleDrop = (e, targetPlayer) => {
    e.preventDefault();
    if (draggedPlayer && targetPlayer && draggedPlayer.id !== targetPlayer.id) {
      const draggedIndex = players.findIndex(p => p.id === draggedPlayer.id);
      const targetIndex = players.findIndex(p => p.id === targetPlayer.id);
      if (draggedIndex !== -1 && targetIndex !== -1) {
        const newPlayers = [...players];
        const [movedPlayer] = newPlayers.splice(draggedIndex, 1);
        newPlayers.splice(targetIndex, 0, movedPlayer);
        if (onReorderPlayers) {
          onReorderPlayers(newPlayers);
        }
      }
    }
    setDraggedPlayer(null);
    setDragOverPlayer(null);
  };
  const handleDragEnd = () => {
    setDraggedPlayer(null);
    setDragOverPlayer(null);
  };
  const handleRemoveClick = (player) => {
    setPlayerToRemove(player);
  };
  const confirmRemove = () => {
    if (playerToRemove) {
      onRemovePlayer(playerToRemove.id);
      setPlayerToRemove(null);
    }
  };
  const cancelRemove = () => {
    setPlayerToRemove(null);
  };
  const handleMenuClick = (playerId) => {
    setMenuOpen(menuOpen === playerId ? null : playerId);
    setEditingPlayer(null);
  };
  const handleEditClick = (player) => {
    setEditingPlayer(player.id);
    setEditName(player.name);
  };
  const handleEditSave = (player) => {
    if (editName.trim() && editName !== player.name) {
      const updatedPlayers = players.map(p =>
        p.id === player.id ? { ...p, name: editName.trim() } : p
      );
      if (onReorderPlayers) onReorderPlayers(updatedPlayers);
    }
    setEditingPlayer(null);
    setMenuOpen(null);
  };
  const handleEditCancel = () => {
    setEditingPlayer(null);
  };

  return (
    <div className="player-queue">
      <div className="player-queue-title-row" style={{display: 'flex', alignItems: 'center', justifyContent: showAddPlayerNextToTitle ? 'center' : 'space-between', gap: showAddPlayerNextToTitle ? 16 : 0}}>
        <h3 className="player-queue-title" style={{marginRight: showAddPlayerNextToTitle ? 12 : 0}}>Player Queue</h3>
        {showAddPlayerNextToTitle && (
          <AddPlayerForm
            minimal
            ref={addPlayerInputRef}
            onAddPlayer={onAddPlayer}
          />
        )}
        {typeof onResetQueue === 'function' && !showAddPlayerNextToTitle && (
          <button
            className="btn btn-danger btn-small"
            style={{marginLeft: 'auto', minWidth: 80}}
            onClick={() => setShowResetConfirm(true)}
          >
            Reset
          </button>
        )}
        {typeof onResetQueue === 'function' && showAddPlayerNextToTitle && (
          <button
            className="btn btn-danger btn-small"
            style={{marginLeft: 12, minWidth: 80}}
            onClick={() => setShowResetConfirm(true)}
          >
            Reset
          </button>
        )}
      </div>
      <div className={`queue-list${compactMode !== 'normal' ? ' ' + compactMode : ''}${menuOpen !== null ? ' menu-active' : ''}`}> 
        {players.length === 0 ? (
          <div className="player-group">
            <div className="player-group-items">
              {!showAddPlayerNextToTitle && (
                <div
                  className="player-item add-player-item"
                  style={{ cursor: 'text' }}
                  draggable={false}
                  onClick={() => {
                    if (addPlayerInputRef.current) addPlayerInputRef.current.focus();
                  }}
                >
                  <AddPlayerForm
                    minimal
                    ref={addPlayerInputRef}
                    onAddPlayer={onReorderPlayers ? (name) => onReorderPlayers([...players, { id: Date.now(), name, gamesPlayed: 0 }]) : () => {}}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          playerGroups.map((group, groupIdx) => (
            <div key={group.groupNumber} className="player-group">
              <div className="player-group-items">
                {group.players.map((player, index) => {
                  const globalIndex = (group.groupNumber - 1) * (players.length >= 20 ? 10 : 5) + index;
                  const isDragging = draggedPlayer?.id === player.id;
                  const isDragOver = dragOverPlayer?.id === player.id;
                  const groupOfFive = Math.floor(globalIndex / 5);
                  const altBg = groupOfFive % 2 === 1;
                  return (
                    <div 
                      key={player.id} 
                      className={`player-item${altBg ? ' alt-bg' : ''} ${isDragging ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''} ${compactMode !== 'normal' ? compactMode : ''}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, player)}
                      onDragOver={(e) => handleDragOver(e, player)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, player)}
                      onDragEnd={handleDragEnd}
                    >
                      <div className="player-info">
                        <span className={`player-number ${compactMode !== 'normal' ? compactMode : ''}`}>{globalIndex + 1}</span>
                        <span className={`player-name ${compactMode !== 'normal' ? compactMode : ''}`}>{player.name}{firstGamePlayed && player.gamesPlayed === 0 && (<span title="Hasn't played yet" style={{marginLeft: 4}}>✨</span>)}{typeof onAssignTeam === 'function' && (<select value={player.team || ''} onChange={e => onAssignTeam(player.id, e.target.value || null)} style={{ marginLeft: 8, fontSize: '0.95em', borderRadius: 4, border: '1.5px solid #e1e5e9', padding: '0.15em 0.5em' }}><option value="">No Team</option><option value="team1">Team 1</option><option value="team2">Team 2</option><option value="team3">Team 3</option><option value="team4">Team 4</option></select>)}</span>
                      </div>
                      <div className="player-actions">
                        <div className={`drag-handle ${compactMode !== 'normal' ? compactMode : ''}`} title="Drag to reorder">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                          </svg>
                        </div>
                        <div className={`player-menu-wrapper${menuOpen === player.id ? ' menu-open' : ''}`}> 
                          <button
                            className={`btn btn-small btn-menu ${compactMode !== 'normal' ? compactMode : ''}`}
                            onClick={() => handleMenuClick(player.id)}
                            title="Player options"
                            tabIndex={0}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                              <circle cx="12" cy="5" r="2" />
                              <circle cx="12" cy="12" r="2" />
                              <circle cx="12" cy="19" r="2" />
                            </svg>
                          </button>
                          {menuOpen === player.id && (
                            <div className="player-menu-dropdown" ref={el => (menuRefs.current[player.id] = el)}>
                              {editingPlayer === player.id ? (
                                <div className="player-edit-form">
                                  <input
                                    className="player-edit-input"
                                    type="text"
                                    value={editName}
                                    onChange={e => setEditName(e.target.value)}
                                    maxLength={30}
                                    autoFocus
                                    onKeyDown={e => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleEditSave(player);
                                      } else if (e.key === 'Escape') {
                                        e.preventDefault();
                                        handleEditCancel();
                                      }
                                    }}
                                  />
                                  <div className="player-edit-actions">
                                    <button className="btn btn-success btn-small" onClick={() => handleEditSave(player)}>
                                      Save
                                    </button>
                                    <button className="btn btn-secondary btn-small" onClick={handleEditCancel}>
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <button className="player-menu-item" onClick={() => handleEditClick(player)}>
                                    Edit
                                  </button>
                                  <button className="player-menu-item remove" onClick={() => { setMenuOpen(null); handleRemoveClick(player); }}>
                                    Remove
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {/* If this is the last group, render AddPlayerForm as a player-item, unless showAddPlayerNextToTitle is true */}
                {groupIdx === playerGroups.length - 1 && !showAddPlayerNextToTitle && (
                  <div
                    className="player-item add-player-item"
                    style={{ cursor: 'text' }}
                    draggable={false}
                    onClick={() => {
                      if (addPlayerInputRef.current) addPlayerInputRef.current.focus();
                    }}
                  >
                    <AddPlayerForm
                      minimal
                      ref={addPlayerInputRef}
                      onAddPlayer={onReorderPlayers ? (name) => onReorderPlayers([...players, { id: Date.now(), name, gamesPlayed: 0 }]) : () => {}}
                    />
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      {/* Confirmation Popup */}
      {playerToRemove && (
        <div className="confirmation-overlay">
          <div className="confirmation-popup">
            <h4>Remove Player</h4>
            <p>Are you sure you want to remove <strong>{playerToRemove.name}</strong> from the queue?</p>
            <div className="confirmation-actions">
              <button className="btn btn-secondary" onClick={cancelRemove}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={confirmRemove}>
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Reset Confirmation Popup */}
      {showResetConfirm && (
        <div className="confirmation-overlay">
          <div className="confirmation-popup">
            <h4>Reset Player Queue</h4>
            <p>Are you sure you want to remove <strong>all players</strong> from the queue?</p>
            <div className="confirmation-actions">
              <button className="btn btn-secondary" onClick={() => setShowResetConfirm(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={() => { setShowResetConfirm(false); if (onResetQueue) onResetQueue(); }}>
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerQueueVolleyball; 