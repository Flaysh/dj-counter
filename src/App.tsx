import { useState, useEffect, useCallback, useRef } from 'react'

interface CounterProps {
  label: string;
  character: string;
  onNameChange: (newName: string) => void;
  isSelected: boolean;
  isCurrentPlayer: boolean;
  onIncrement: () => void;
  isFullscreen: boolean;
}

function Counter({ label, character, onNameChange, isSelected, isCurrentPlayer, onIncrement, isFullscreen }: CounterProps) {
  const [count, setCount] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [tempName, setTempName] = useState(character)
  const [showScoreEffect, setShowScoreEffect] = useState(false)
  const displayRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const increment = () => {
    setCount(count + 1)
    onIncrement()
    // Show score effect
    setShowScoreEffect(true)
    setTimeout(() => setShowScoreEffect(false), 500)
    
    // Add confetti effect
    if (displayRef.current) {
      const display = displayRef.current;
      const rect = display.getBoundingClientRect();
      createParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
  }
  const decrement = () => setCount(Math.max(0, count - 1))
  const reset = () => {
    setCount(0)
  }

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNameChange(tempName)
    setIsEditing(false)
  }

  const handleDoubleClick = () => {
    setIsEditing(true)
    setTempName(character)
  }

  // Create class names with selection states
  const containerClassName = `counter ${isSelected ? 'selected' : ''} ${isCurrentPlayer ? 'current-player' : ''} ${isFullscreen ? 'fullscreen-counter' : ''}`;

  // Return focus to the increment button if this counter is selected
  useEffect(() => {
    if (isSelected && buttonRef.current) {
      buttonRef.current.focus();
    }
  }, [isSelected]);

  return (
    <div className={containerClassName}>
      <div className="player-info">
        <div className="dj-label">{label}</div>
        {isEditing ? (
          <form onSubmit={handleNameSubmit} className="name-edit-form">
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="name-input"
              autoFocus
              onBlur={handleNameSubmit}
              maxLength={12}
            />
          </form>
        ) : (
          <div
            className="character-name"
            onDoubleClick={handleDoubleClick}
            title="Double click to edit"
          >
            {character}
          </div>
        )}
      </div>
      <div className="battle-display">
        <div className={`counter-display ${showScoreEffect ? 'score-added' : ''}`} ref={displayRef}>
          {count}
          {showScoreEffect && <div className="score-effect">+1</div>}
        </div>
      </div>
      <div className="counter-buttons">
        <button onClick={decrement}>-</button>
        <button 
          onClick={increment} 
          ref={buttonRef}
          className={isSelected ? 'primary-button' : ''}
        >+</button>
      </div>
      <button className="reset-button" onClick={reset}>RESET</button>
      {isCurrentPlayer && (
        <div className="current-player-indicator">
          <span className="playing-text">PLAYING NOW</span>
          <div className="sound-wave">
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
        </div>
      )}
    </div>
  )
}

// Create particles function for confetti effect
function createParticles(x: number, y: number) {
  const colors = ['#ffd700', '#ff00ff', '#00ffff', '#ff6b6b', '#ffffff'];
  
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    document.body.appendChild(particle);
    
    // Random styles
    const size = Math.random() * 8 + 6;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 6 + 4;
    const lifetime = Math.random() * 500 + 500;
    
    // Set particle styles
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.backgroundColor = color;
    particle.style.boxShadow = `0 0 ${size}px ${color}`;
    
    // Random position
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    
    // Animation
    let timer = 0;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;
    const gravity = 0.1;
    let posX = x;
    let posY = y;
    let velocityY = vy;
    
    const animateParticle = () => {
      timer++;
      if (timer >= lifetime) {
        particle.remove();
        return;
      }
      
      // Physics
      velocityY += gravity;
      posX += vx;
      posY += velocityY;
      
      // Update position
      particle.style.left = `${posX}px`;
      particle.style.top = `${posY}px`;
      
      // Fade out
      particle.style.opacity = `${1 - timer / lifetime}`;
      
      requestAnimationFrame(animateParticle);
    };
    
    requestAnimationFrame(animateParticle);
  }
}

// Audio visualizer component
function Visualizer({ isActive }: { isActive: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!isActive || !containerRef.current) return;
    
    // Create visualizer bars
    const container = containerRef.current;
    const barCount = 48; // Increased bar count for more impressive visualizer
    
    // Clear previous bars if any
    container.innerHTML = '';
    
    // Create bars
    for (let i = 0; i < barCount; i++) {
      const bar = document.createElement('div');
      bar.className = 'visualizer-bar';
      container.appendChild(bar);
      
      // Set initial height and position
      const height = Math.random() * 50 + 10;
      bar.style.height = `${height}px`;
      bar.style.left = `${(100 / barCount) * i}%`;
    }
    
    // Animate bars
    let animationId: number;
    
    const animate = () => {
      const bars = container.querySelectorAll('.visualizer-bar');
      bars.forEach(bar => {
        // Make heights follow a more realistic audio pattern
        const height = Math.random() * 100 + 10;
        (bar as HTMLElement).style.height = `${height}px`;
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isActive]);
  
  if (!isActive) return null;
  
  return <div className="visualizer-container" ref={containerRef}></div>;
}

// Turntable component for DJ visual
function Turntable({ isVisible }: { isVisible: boolean }) {
  if (!isVisible) return null;
  
  return (
    <div className="turntable-container">
      <div className="turntable">
        <div className="record">
          <div className="record-label"></div>
        </div>
        <div className="tonearm"></div>
      </div>
    </div>
  );
}

function App() {
  const [players, setPlayers] = useState([
    { id: 1, label: "PLAYER 1", name: "DANI." },
    { id: 2, label: "PLAYER 2", name: "MATOKI" },
    { id: 3, label: "PLAYER 3", name: "SONSHINE" }
  ])
  const [selectedPlayerId, setSelectedPlayerId] = useState(1)
  const [currentPlayerId, setCurrentPlayerId] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)
  const appRef = useRef<HTMLDivElement>(null);

  const handleNameChange = (id: number, newName: string) => {
    setPlayers(players.map(player =>
      player.id === id ? { ...player, name: newName.toUpperCase() } : player
    ))
  }

  const selectNextPlayer = useCallback(() => {
    const currentIndex = players.findIndex(player => player.id === selectedPlayerId);
    const nextIndex = (currentIndex + 1) % players.length;
    setSelectedPlayerId(players[nextIndex].id);
  }, [players, selectedPlayerId]);

  const selectPrevPlayer = useCallback(() => {
    const currentIndex = players.findIndex(player => player.id === selectedPlayerId);
    const prevIndex = (currentIndex - 1 + players.length) % players.length;
    setSelectedPlayerId(players[prevIndex].id);
  }, [players, selectedPlayerId]);

  const handlePlayerIncrement = () => {
    // This is called when a player's score is incremented
    // Add sound effect or other feedback here if desired
  }

  const setCurrentPlayer = (id: number) => {
    setCurrentPlayerId(id);
    setSelectedPlayerId(id); // Also select the player when setting as current
  }

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error(`Error attempting to enable fullscreen: ${e.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // After toggling fullscreen, move focus to the selected player
  useEffect(() => {
    // Brief timeout to ensure DOM updates have completed
    const timeoutId = setTimeout(() => {
      const selectedPlayerButton = document.querySelector(`.counter.selected .counter-buttons button:nth-child(2)`);
      if (selectedPlayerButton instanceof HTMLElement) {
        selectedPlayerButton.focus();
      }
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [isFullscreen]);

  // Toggle instructions visibility
  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        selectNextPlayer();
      } else if (e.key === 'ArrowLeft') {
        selectPrevPlayer();
      } else if (e.key === 'Enter') {
        // Find the counter component for the selected player and trigger its increment
        const incrementButton = document.querySelector(`.counter.selected .counter-buttons button:nth-child(2)`);
        if (incrementButton instanceof HTMLButtonElement) {
          incrementButton.click();
        }
      } else if (e.key === ' ') {
        // Space key toggles current player
        setCurrentPlayer(selectedPlayerId);
        e.preventDefault(); // Prevent scrolling
      } else if (e.key === 'f') {
        // F key toggles fullscreen
        toggleFullscreen();
      } else if (e.key === 'h') {
        // H key toggles instructions
        toggleInstructions();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectNextPlayer, selectPrevPlayer, selectedPlayerId]);

  // Instructions component
  const Instructions = () => (
    <div className={`keyboard-instructions ${isFullscreen ? 'fullscreen-instructions' : ''} ${!showInstructions ? 'hidden' : ''}`}>
      <div className="instruction"><span>◀ ▶</span> Switch between DJs</div>
      <div className="instruction"><span>ENTER</span> Add point to selected DJ</div>
      <div className="instruction"><span>SPACE</span> Set as current player</div>
      <div className="instruction"><span>F</span> Toggle fullscreen</div>
      <div className="instruction"><span>H</span> Hide/show this help</div>
      <button className="close-help-button" onClick={toggleInstructions}>×</button>
    </div>
  );

  // Help toggle button
  const HelpToggle = () => (
    <button 
      className={`help-toggle ${!showInstructions ? 'show-help' : ''}`} 
      onClick={toggleInstructions}
      title="Show keyboard shortcuts"
    >
      ?
    </button>
  );

  // Current event info
  const EventInfo = () => (
    <div className={`event-info ${isFullscreen ? 'fullscreen-mode' : ''}`}>
      <div className="event-title">DJ CONTEST 2023</div>
      <div className="current-dj">
        NOW PLAYING: <span className="dj-name">{players.find(p => p.id === currentPlayerId)?.name || 'NONE'}</span>
      </div>
    </div>
  );

  // Background visual effects
  const BackgroundEffects = () => (
    <div className={`background-effects ${isFullscreen ? 'active' : ''}`}>
      <div className="glow-effect top-left"></div>
      <div className="glow-effect bottom-right"></div>
      <div className="glow-effect center"></div>
    </div>
  );

  return (
    <div className={`app ${isFullscreen ? 'fullscreen-mode' : ''}`} ref={appRef}>
      <BackgroundEffects />
      <Visualizer isActive={isFullscreen} />
      <Turntable isVisible={isFullscreen} />
      
      <div className="header">
        <h1 className="title">DJ TEKKEN</h1>
        <div className="subtitle">SCORE BATTLE</div>
        <button className="fullscreen-button" onClick={toggleFullscreen}>
          {isFullscreen ? 'EXIT FULLSCREEN' : 'FULLSCREEN MODE'}
        </button>
      </div>
      <div className="counter-container">
        {players.map(player => (
          <Counter
            key={player.id}
            label={player.label}
            character={player.name}
            onNameChange={(newName) => handleNameChange(player.id, newName)}
            isSelected={player.id === selectedPlayerId}
            isCurrentPlayer={player.id === currentPlayerId}
            onIncrement={handlePlayerIncrement}
            isFullscreen={isFullscreen}
          />
        ))}
      </div>
      <div className="bottom-info">
        <EventInfo />
      </div>
      <Instructions />
      {!showInstructions && <HelpToggle />}
    </div>
  )
}

export default App
