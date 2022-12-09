import React from "react"
import { Link } from "react-router-dom"
import "./navbar.css"
export default class Navbar extends React.Component{
  render(){
    return(
      <nav className="nav slide-in-top">
        <div className="nav-1">
          <Link className="site-title" to="/">LECSUM</Link>
        </div>
        <ul>
          <li>
            <Link to="/about">About</Link>
          </li> 
          <li>
            <a target="_blank" href="https://github.com/NishantNepal1/LecSum">GitHub</a>
          </li>
          <li>
          <Link to="/others">Contact Us</Link>
          </li>
        </ul>
      </nav>
    )
  }
}