import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SpotifyArticle from './pages/SpotifyArticle'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/articles/spotify" element={<SpotifyArticle />} />
      </Routes>
    </Router>
  )
}

export default App

