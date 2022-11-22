import React from "react"
import { Link } from "react-router-dom"
import "./navbar.css"
export default class Navbar extends React.Component{
  render(){
    return(
      <nav className="nav">
        <Link className="site-title" to="/">LecSum</Link>
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