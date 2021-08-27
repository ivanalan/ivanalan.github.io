import Topbar from "./components/topbar/Topbar";
import Intro from "./components/intro/Intro";
import Portfolio from "./components/portfolio/Portfolio";
import Works from "./components/works/Works";
import Testimonials from "./components/testimonials/Testimonials";
import Main from "./components/main/Main";
import Contact from "./components/contact/Contact";
import Schwab from "./components/schwab/Schwab";
import "./app.scss";
import { useState } from "react";
import Menu from "./components/menu/Menu";
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom';


function App() {
  const [menuOpen,setMenuOpen] = useState(false);
  return (
    <div className="app">
     <Topbar menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>
     <Menu menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>
     <div className="sections">
       <Intro/>
       <Portfolio/>
       <Works/>
       <Testimonials/>
     </div>
    </div>
  );
}

export default App;
