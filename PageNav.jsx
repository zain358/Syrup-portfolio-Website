import React from 'react';

export default function PageNav({ isOpen, onClose, onOpenPlayer, onNavigate }) {
  const menuItems = [
    { num: '01', label: 'MUSIC PLAYER', action: 'player' },
    { num: '02', label: 'PERSONAL DETAILS', action: 'details' },
    { num: '03', label: 'CHESS ARENA', action: 'chess' },
    { num: '04', label: 'CAR ARCADE', action: 'car' }
  ];

  const handleItemClick = (action) => {
    onClose();
    if (action === 'player') {
      setTimeout(() => {
        onOpenPlayer();
      }, 800); // Stagger to wait for curtain to slide back
    } else {
      setTimeout(() => {
        onNavigate(action);
      }, 800);
    }
  };

  return (
    <nav className={`page-nav ${isOpen ? 'is-active' : ''}`}>
      {/* Liquid Curtain Layers */}
      <div className="nav-curtain">
        <span />
        <span />
        <span />
      </div>

      {/* Main Navigation Container */}
      <div className="nav-container">
        <div className="nav-menu-wrapper">
          <div className="nav-menu-header">MENU CONTENTS</div>
          <ul className="nav-menu-list">
            {menuItems.map((item, idx) => (
              <li key={idx} className="nav-menu-item">
                <a
                  className="nav-menu-link"
                  onClick={() => handleItemClick(item.action)}
                >
                  <span className="menu-num">{item.num}</span>
                  <span className="menu-label">{item.label}</span>
                  <span className="menu-arrow">→</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
