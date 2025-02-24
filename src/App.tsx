import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  const increment = () => setCount(count + 1)
  const decrement = () => setCount(Math.max(0, count - 1))
  const reset = () => setCount(0)

  return (
    <div className="counter">
      <div className="counter-display">
        {count}
      </div>
      <div className="counter-buttons">
        <button onClick={decrement}>-</button>
        <button onClick={increment}>+</button>
      </div>
      <button className="reset-button" onClick={reset}>RESET</button>
    </div>
  )
}

function App() {
  return (
    <div className="counter-container">
      <Counter />
      <Counter />
      <Counter />
    </div>
  )
}

export default App
