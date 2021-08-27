import "./menu.scss" 

export default function Menu({ menuOpen, setMenuOpen }) {
    return (
        <div className={"menu " + (menuOpen && "active")}>
            <ul>
                <li onClick={()=>setMenuOpen(false)}>
                    <a href="#intro">Home</a>
                </li>
                <li  onClick={()=>setMenuOpen(false)}>
                    <a href="#portfolio">Design</a>
                </li>
                <li  onClick={()=>setMenuOpen(false)}>
                    <a href="#works">Code</a>
                </li>
                <li  onClick={()=>setMenuOpen(false)}>
                    <a href="#testimonials">About</a>
                </li>
            </ul>
            
        </div>
    )
}
