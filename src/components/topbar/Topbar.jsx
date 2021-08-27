import "./topbar.scss"
import {Person,Mail} from "@material-ui/icons"

export default function Topbar({ menuOpen, setMenuOpen }) {
    return (
        <div className={"topbar " + (menuOpen && "active")}>
            <div className="wrapper">
                <div className="left">
                    <a href="#intro" className="logo">Alan Matias</a>
                    <div className="itemContainer">
                        <h4>let's connect on <a href="https://www.linkedin.com/in/alanmatias/" target="_blank">LinkedIn</a></h4>
                    </div>
                    <div className="itemContainer">
                        <h4>take a look at my <a href="assets/Alan_Matias_Resume.pdf" target="_blank">resume</a> </h4>
                    </div>
                </div>
                <div className="right">
                    <div className="hamburger" onClick={() =>setMenuOpen(!menuOpen)}>
                        <span className="line1"></span>
                        <span className="line2"></span>
                        <span className="line3"></span>

                    </div>
                </div> 
            </div>
        </div>
    )
}
