import React from 'react'
import Navbar from './components/navbar/navbar';
import About from './pages/About';
import Home from './pages/Home';
import Others from './pages/Others';
import {Route, Routes} from "react-router-dom"
import "./App.css"
export default class App extends React.Component{
  render(){
    return(
      <React.Fragment>
        <Navbar/>
        <div className='container'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/others" element={<Others />} />
          </Routes>
        </div>
      </React.Fragment>
    )
  }
}
