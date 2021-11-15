import "./works.scss"

export default function works() {
    return (
        <div className="works" id="works">
             <h1>Code</h1>
            <h5>(hover over each to get more info)</h5>

            <div className="container"> 

                <a href="https://medium.com/@alan.matias/pinfo-georgia-tech-humanitech-570ce5f84333" target="_blank">
                    <div className="item">
                        <img src="assets/PINFO.png" alt="" />
                        <h3>Pinfo - Georgia Tech Research</h3>
                        <h4>A simple, visual app to communicate how and when to take medication (and its purpose) 
                            as an alternative to text-heavy instructions. 
                            Designed in Adobe Xd and developed in React Native</h4>
                    </div>  
                </a>

                <a href="https://medium.com/@alan.matias/google-college-chat-39003c7fa3ce" target="_blank">
                    <div className="item">
                        <img src="assets/4.png" alt="" />
                        <h3>Google - SPS</h3>
                        <h4>A chat web application connecting students and professors working from home</h4>
                    </div>
                </a>
 
                <a href="https://medium.com/@alan.matias/cs-4470-teaching-assistant-4a6ca8eb40a4" target="_blank">
                    <div className="item">
                        <img src="assets/5.png" alt="" />
                        <h3>UI Software (CS 4470)</h3>
                        <h4>As a Teaching Assistant I created a Calendar GUI using Java Swing
                        </h4>
                    </div>
                </a>
            </div>
        </div>
    )
}
