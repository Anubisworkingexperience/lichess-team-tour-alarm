import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1 className='underline'>Lichess tournament notifier 🏆</h1>
      <label htmlFor="team">Team link/id</label>
      <input type="text" name="team" id="team" />
      <h2>Next tournament in: </h2>
    </>
  )
}

export default App
