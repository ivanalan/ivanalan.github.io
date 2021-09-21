import "./intro.scss"
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { useEffect, useRef } from "react"
import { init } from "ityped";

export default function Intro() {
    const textRef = useRef();

    useEffect(() => {
        init(textRef.current, {
            backDelay: 1500,
            backSpeed: 60,
            showCursor: true,
            strings: ["UI UX Designer", "Front End Developer", "Filmmaker"],
        });
    },[])


    return (
        <div className="intro" id="intro">
            <div className="left">
                <div className="imgContainer">
                    <img src="assets/profile2NoBg2.png" alt=""/>
                </div>
            </div>
            <div className="right">
                <div className="wrapper">
                    <h2>Hey! I'm Alan <span className="pronouns"> (he/him)</span></h2>
                    <h2>I am a <span ref={textRef}></span></h2>
                    <h3>Currently a Masters student at Georgia Tech studying Computer Science / HCI and looking for a 2022 full time role in <span>UX Design.</span></h3>
                </div>
                <a href="#portfolio">                    
                    <ExpandMoreIcon className="icon"/>
                </a>
            </div>
        </div>
    )
}
