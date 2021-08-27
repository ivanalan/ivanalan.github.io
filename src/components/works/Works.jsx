import "./works.scss"

export default function works() {
    return (
        <div className="works" id="works">
             <h1>Code</h1>
            <h5>(hover over each to get more info)</h5>

            <div className="container"> 

                <a href="https://medium.com/@alan.matias/humanitech-kenyan-crop-prices-23617882fe9b" target="_blank">
                    <div className="item">
                        <img src="assets/6.png" alt="" />
                        <h3>Humanitech - Crop Pricing</h3>
                        <h4>A react web app helping Kenyan farmers accurately price their crops</h4>
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
