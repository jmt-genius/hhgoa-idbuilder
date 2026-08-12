import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import GeneratorPage from './pages/GeneratorPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create" element={<GeneratorPage />} />
      </Routes>
    </Router>
  )
}

export default App