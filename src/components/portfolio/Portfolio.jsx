import "./portfolio.scss"
import { Link, withRouter } from "react-router-dom";
import { BrowserRouter, Switch, Route } from 'react-router-dom';

export default function Portfolio() {
    return (
        <div className="portfolio" id="portfolio">
            <h1>Design</h1>
            <h5>(hover over each to get more info)</h5>
            <div className="container">
                
                <a href="https://medium.com/@alan.matias/charles-schwab-internship-de7cbf82bf4" target="_blank">
                        <div className="item">
                            <img src="assets/schwabLogo.png" alt="" />
                            <h3>Charles Schwab internship</h3>
                            <h4>I designed a responsive, table-based interface as well as an "award winning" mobile app </h4>
                        </div> 
                </a>

                <a href="https://medium.com/@alan.matias/chick-fil-a-ux-design-internship-399dc5f07a0" target="_blank">
                    <div className="item">
                        <img src="assets/chikfila.png" alt="" />
                        <h3>Chick-fil-a internship</h3>
                        <h4>I planned and executed a 6-week design sprint to redesign an iPad interface for ~100k employees</h4>
                    </div>
                </a>
 
                <a href="https://medium.com/@alan.matias/razzmatazz-design-project-a8e6e39a4196" target="_blank">
                    <div className="item">
                        <img src="assets/rz.png" alt="" />
                        <h3>Razzmatazz</h3>
                        <h4>I developed a prototype to combat pickpocketing in Barcelona 
                        </h4>
                    </div>
                </a>
            </div>
            
        </div>
    )
}
