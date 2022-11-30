import { useState } from 'react'
import { Routes, Route } from "react-router-dom"
import Home from './pages/Home'
import Board from './pages/Board'
import './App.css'


function App() {
  const [start, setStart] = useState<number>(0)

  return (
    <div style={{height: '100%', width: '100%'}}>
      <Routes>
        <Route path="/" element={ <Home/> } />
        <Route path="/battle" element={ <Board/> } />
      </Routes>
    </div>
  )
}

export default App
