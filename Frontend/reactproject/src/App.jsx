import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Hello from './Hello'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <h1>Hello React!</h1>
        <button onClick={() => setCount(count + 1)}>
            count is {count}
          </button>
          <Hello />
    </>
  )
}

export default App
