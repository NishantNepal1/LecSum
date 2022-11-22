import React from 'react'
import PropTypes from 'prop-types'
import './messagebox.css'

interface MessageBoxProps{
  state       : Boolean,
  className?  : string,
  children    : Array<React.Component>,
}

export default class MessageBox extends React.Component<MessageBoxProps, any>{
  render(){
    const {state, className, children} = this.props
    const fixClassName = className ? className : ''
    return(
      <div
        className = "message-box-background"
        style = {{display : state ? 'flex' : 'none'}}
      >
        <div className = {"message-box " + fixClassName}>
          {children}
        </div>
      </div>
    )
  }
}

MessageBox.propTypes = {
  state : PropTypes.bool,
  className: PropTypes.string
}
