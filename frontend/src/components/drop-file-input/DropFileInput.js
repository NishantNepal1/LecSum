import React from "react"
import PropTypes from 'prop-types'

import "./drop-file-input.css"

import { ImageConfig } from "../../config/ImageCongif";
import uploadImg from "../../assets/cloud-upload-regular-240.png"
export default class DropFileInput extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      files_list: []
    }
  }
  uploadFiles = (files) => {
    if (this.state.files_list.length + files.length > 5) {
      alert("You can only process with 5 PDF files.")
      return
    }
    let files_list = this.state.files_list
    for (let i = 0; i < files.length; i++){
      if (!files_list.includes(files[i])) {
        files_list.push(files[i])
      }
    }
    this.setState({
      files_list: files_list
    })
    this.props.uploadFiles(files_list)
  }
  deleteFromFiles = (item) => {
    let files_list = this.state.files_list
    let index = files_list.indexOf(item);
    if (index > -1) {
      files_list.splice(index, 1);
    }
    this.setState({files_list: files_list})
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
        {
          this.state.files_list.length > 0 && 
          <div className="drop-files-preview">
            <p className="drop-file-preview__title">
              Uploaded files
            </p>
            {
              this.state.files_list.map((item, index)=>
                <div
                  key={index}
                  className = "drop-file-preview__item"
                >
                  <img 
                    src={ImageConfig[item.type.split("/")[1] || 
                    ImageConfig['default']]} 
                    alt=""
                  />
                  <div className="drop-file-preview__item__info">
                    <p>{item.name}</p>
                    {/* <p>{item.size}</p> */}
                  </div>
                  <span
                    className="drop-file-preview__item__del"
                    onClick={()=>this.deleteFromFiles(item)}
                  >
                    x
                  </span>
                </div>
              )
            }
          </div>
        }
      </div>
    )
  }
}