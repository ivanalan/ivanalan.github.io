import AsciiMotionAnimation from './components/ascii-motion-animation'

function App() {
  return (
    <div className="container">
      <div className="animation-wrapper">
        <AsciiMotionAnimation showControls={true} autoPlay={true} />
      </div>
      <div className="text-content">
        <h1 className="header">currently designing at qualtrics</h1>
        <p className="body">new portfolio coming soon</p>
      </div>
    </div>
  )
}

export default App

