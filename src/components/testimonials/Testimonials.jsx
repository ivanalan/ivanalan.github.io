import "./testimonials.scss"

export default function Testimonials() {
    return (
        <div className="testimonials" id="testimonials">
             <div className="left">
                 <div className="wrapper">
                    <h2>About me &#129488; </h2>
                    <h3>Hi, I'm Alan. I am a student designer at <span>Georgia Tech</span> with a 
                        passion for accessible, inclusive, and universal design. One of the most 
                        important things I priortize in my work is being empathetic with all users
                        so I can understanding their needs and pains to look for opportunities to innovate.
                    </h3>
                    <h3>I also love everything related to film & art&nbsp;
                        <a href="https://www.youtube.com/watch?v=HnKRunkGWF0" target="_blank">(Check out this stop motion video I made about covid)</a>
                        &nbsp;. I like paint and draw in my free time, and I'm a huge fan of Wes Anderson and Yasujirō Ozu.  

                    </h3>
                 </div>

             </div>


             <div className="right">
                <div className="imgContainer">
                    <img src="assets/flower.jpg" alt=""/>
                </div>
             </div>
        </div>
    )
}
