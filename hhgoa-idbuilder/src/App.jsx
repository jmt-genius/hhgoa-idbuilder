import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import GeneratorPage from './pages/GeneratorPage'
import IdGeneratorPage from './pages/IdGeneratorPage'
import TeamFramePage from './pages/TeamFramePage'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create" element={<GeneratorPage />} />
        <Route path="/id-generator" element={<IdGeneratorPage />} />
        <Route path="/team-frame" element={<TeamFramePage />} />
      </Routes>
    </Router>
  )
}

export default App