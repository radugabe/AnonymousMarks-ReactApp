import React from "react";
import "../styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1 className="navbar-logo">Anonymous Marks  -  powered by Radu, Vlad and Alicia</h1>
      {/* <ul className="navbar-links">
        <li><a href="/">Dashboard</a></li>
        <li><a href="/projects">Proiecte</a></li>
        <li><a href="/evaluation">Evaluare</a></li>
      </ul> */}
    </nav>
  );
};

export default Navbar;
