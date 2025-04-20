import React from 'react';

interface DpadProps {
  onInteraction: (direction: string | null) => void;
}

const buttonStyle: React.CSSProperties = {
  width: '50px',
  height: '50px',
  border: '1px solid #ccc',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '20px',
  cursor: 'pointer',
  userSelect: 'none', // Prevent text selection
  WebkitUserSelect: 'none',
  msUserSelect: 'none',
};

const Dpad: React.FC<DpadProps> = ({ onInteraction }) => {

  const handlePress = (direction: string) => {
    onInteraction(direction);
  };

  const handleRelease = () => {
    onInteraction(null); // Signal release
  };

  // Use mouse events for simplicity, works on touch too
  const commonEvents = (direction: string) => ({
    onMouseDown: () => handlePress(direction),
    onMouseUp: handleRelease,
    onMouseLeave: handleRelease, // Stop if mouse leaves button while pressed
    onTouchStart: (e: React.TouchEvent) => { e.preventDefault(); handlePress(direction); },
    onTouchEnd: (e: React.TouchEvent) => { e.preventDefault(); handleRelease(); },
    onTouchCancel: (e: React.TouchEvent) => { e.preventDefault(); handleRelease(); },
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 50px)', gridTemplateRows: 'repeat(3, 50px)', gap: '5px', justifyContent: 'center', marginTop: '20px' }}>
      <div style={{ gridColumn: '2', gridRow: '1' }}>
        <div style={buttonStyle} {...commonEvents('ArrowUp')}>
          ↑
        </div>
      </div>
      <div style={{ gridColumn: '1', gridRow: '2' }}>
        <div style={buttonStyle} {...commonEvents('ArrowLeft')}>
          ←
        </div>
      </div>
      <div style={{ gridColumn: '3', gridRow: '2' }}>
        <div style={buttonStyle} {...commonEvents('ArrowRight')}>
          →
        </div>
      </div>
      <div style={{ gridColumn: '2', gridRow: '3' }}>
        <div style={buttonStyle} {...commonEvents('ArrowDown')}>
          ↓
        </div>
      </div>
    </div>
  );
};

export default Dpad; 