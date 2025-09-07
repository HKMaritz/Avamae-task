import { NavLink } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/Logo.svg"; 

export default function Navbar() {
  const [ping, setPing] = useState(false);
  const linkClass = ({ isActive }) =>
    `nav-link ${isActive ? "active" : ""} ${ping ? "glow" : ""}`;

  const flashNav = () => {
    setPing(true);
    setTimeout(() => setPing(false), 1000); // 1s soft blue oval glow over each nav item
  };

  return (
    <header className="site-header">
      <div className="wrap">
        <a className="brand" href="/" aria-label="Home">
          <img src={logo} alt="" />
        </a>

        <nav className="main-nav" aria-label="Primary">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/about-us" className={linkClass}>About us</NavLink>
          <NavLink to="/contact-us" className={linkClass}>Contact us</NavLink>
          <button type="button" className="signin-btn" onClick={flashNav}>
            Sign in
          </button>
        </nav>
      </div>
    </header>
  );
}
