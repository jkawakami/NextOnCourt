import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

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
      if (!e.target.closest('.sport-emoji-menu') && !e.target.closest('.sport-emoji-dropdown')) {
        setOpen(false);
      }
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
          <div className="sport-emoji-menu" style={{ position: 'absolute', left: 0, top: '110%', background: 'white', border: '1px solid #e1e5e9', borderRadius: 8, boxShadow: '0 2px 16px rgba(0,0,0,0.18)', zIndex: 9999, minWidth: 140 }}>
            <button className="sport-emoji-item" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '1.1rem', padding: '0.5rem 1.2rem', background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }} onClick={() => handleSelect('🏀')}>
              <span style={{ fontSize: '1.5rem' }}>🏀</span>
              <span>Basketball</span>
            </button>
            <button className="sport-emoji-item" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '1.1rem', padding: '0.5rem 1.2rem', background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }} onClick={() => handleSelect('🏐')}>
              <span style={{ fontSize: '1.5rem' }}>🏐</span>
              <span>Volleyball</span>
            </button>
          </div>
        )}
      </div>
      <span style={{ fontWeight: 700, fontSize: '1.8rem', verticalAlign: 'middle' }}>Next On Court</span>
    </header>
  );
}

export default SportHeader; 