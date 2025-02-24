import { useState } from 'react'

interface CounterProps {
  label: string;
  character: string;
  onNameChange: (newName: string) => void;
}

function Counter({ label, character, onNameChange }: CounterProps) {
  const [count, setCount] = useState(0)
  const [wins, setWins] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [tempName, setTempName] = useState(character)

  const increment = () => setCount(count + 1)
  const decrement = () => setCount(Math.max(0, count - 1))
  const reset = () => {
    setCount(0)
    setWins(0)
  }

  const addWin = () => setWins(Math.min(3, wins + 1))
  const removeWin = () => setWins(Math.max(0, wins - 1))

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNameChange(tempName)
    setIsEditing(false)
  }

  const handleDoubleClick = () => {
    setIsEditing(true)
    setTempName(character)
  }

  return (
    <div className="counter">
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
        <div className="win-markers">
          {[...Array(3)].map((_, i) => (
            <div key={i} className={`win-marker ${i < wins ? 'won' : ''}`} />
          ))}
        </div>
        <div className="counter-display">
          {count}
        </div>
      </div>
      <div className="counter-buttons">
        <button onClick={decrement}>-</button>
        <button onClick={increment}>+</button>
      </div>
      <div className="win-buttons">
        <button className="win-button" onClick={removeWin}>-W</button>
        <button className="win-button" onClick={addWin}>+W</button>
      </div>
      <button className="reset-button" onClick={reset}>RESET</button>
    </div>
  )
}

function App() {
  const [round, setRound] = useState(1)
  const [players, setPlayers] = useState([
    { id: 1, label: "PLAYER 1", name: "DANI." },
    { id: 2, label: "PLAYER 2", name: "SONSHINE" },
    { id: 3, label: "PLAYER 3", name: "MATOKI" }
  ])

  const nextRound = () => setRound(round + 1)
  const prevRound = () => setRound(Math.max(1, round - 1))

  const handleNameChange = (id: number, newName: string) => {
    setPlayers(players.map(player =>
      player.id === id ? { ...player, name: newName.toUpperCase() } : player
    ))
  }

  return (
    <div className="app">
      <div className="header">
        <h1 className="title">DJ TEKKEN</h1>
        <div className="subtitle">SCORE BATTLE</div>
        <div className="round-display">
          <button className="round-button" onClick={prevRound}>◀</button>
          <div className="round-text">ROUND {round}</div>
          <button className="round-button" onClick={nextRound}>▶</button>
        </div>
      </div>
      <div className="counter-container">
        {players.map(player => (
          <Counter
            key={player.id}
            label={player.label}
            character={player.name}
            onNameChange={(newName) => handleNameChange(player.id, newName)}
          />
        ))}
      </div>
    </div>
  )
}

export default App
