import React from "react"
import { Link } from "react-router-dom"
import "./navbar.css"
export default class Navbar extends React.Component{
  render(){
    return(
      <nav className="nav">
        <div className="nav-1">
          <Link className="site-title" to="/">LECSUM</Link>
        </div>
        <ul>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/others">Others</Link>
          </li>
        </ul>
      </nav>
    )
  }
}