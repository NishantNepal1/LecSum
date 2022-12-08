import React from "react"
import PropTypes from 'prop-types'

import "./drop-file-input.css"

import { ImageConfig } from "../../config/ImageCongif";
import uploadImg from "../../assets/upload.gif"
import MessageBox from "../messagebox/messagebox";
export default class DropFileInput extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      files_list: [],
      limitFilesMsgBox: false
    }
  }
  uploadFiles = (files) => {
    // if (this.state.files_list.length + files.length > 5) {
    //   this.setState({limitFilesMsgBox: true})
    //   return
    // }
    this.props.uploadFiles(files)
  }
  deleteFromFiles = (item, index) => {
    let files_list = this.state.files_list
    if (index > -1) {
      files_list.splice(index, 1);
    }
    this.setState({files_list: files_list})
  }
  renderLimitMsgBox(){
    return(
      <MessageBox state={this.state.limitFilesMsgBox}>
        <p>You can only upload up to 5 files.</p>
        <button
          className="msg-button"
          onClick={()=>this.setState({limitFilesMsgBox: false})}
        >
          close
        </button>
      </MessageBox>
    )
  }
  render(){
    const dragFunction = (event, type) => {
      event.preventDefault();
      event.stopPropagation();
      if (type === 'drop' && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
        this.uploadFiles(event.dataTransfer.files)
        event.dataTransfer.clearData()
      }
    }
    return(
      <div className="drop-file-input__main">
        <div
          onDragOver  = {(event) => dragFunction(event, 'over')}
          onDrop      = {(event) => dragFunction(event, 'drop')}
          onDragEnter = {(event) => dragFunction(event, 'enter')}
          onDragLeave = {(event) => dragFunction(event, 'leave')}
          className="drop-file-input"
          draggable
        >
          <div className="drop-file-input__label">
            <img src={uploadImg} alt="" />
            <p>Drag and Drop your file here</p>
          </div>
          <input 
            type='file'
            multiple
            accept=".pdf"
            onChange={(event) => this.uploadFiles(event.target.files)}
          />
        </div>
        {/* {this.renderLimitMsgBox()} */}
      </div>
    )
  }
}