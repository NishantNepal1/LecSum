import React from "react"
import { NLPapi } from "../API/NLP"
import DropFileInput from "../components/drop-file-input/DropFileInput"
import MessageBox from "../components/messagebox/messagebox"
import "./home.css"
export default class Home extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      filesMsgBox: false,
      noFilesMsgBox: false,
      files_list: []
    }
    this.nlp = new NLPapi()
  }
  uploadFiles = (files) =>{
    this.setState({files_list: files})
  }
  handleSubmit = () => {
    if(this.state.files_list.length > 0){
      let list = []
      this.state.files_list.forEach((item) => {
        list.push(item.name)
      })
      let postData = {
        process_id: this.procId,
        ligand: list
      }
      this.nlp.downloadFiles(postData).then((resp) => {
        let blob = new Blob([resp.data], { type: "application/pdf", responseType: 'arraybuffer'});
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = 'Summary.pdf'
        if (typeof link.download === 'undefined') {
          link.setAttribute('target', '_blank');
        }
        link.click()
      }).catch((err) => {
        console.error(err)
      })
      this.setState({filesMsgBox: true})
    }
    else{
      this.setState({noFilesMsgBox: true})
    }
  }
  render(){
    return(
      <div>
        <div className="description">
          LecSum - Summarization Tool for your Lecture Notes
        </div>
        <div className="box">
          <h2 className="header">
            Input your PDF files below
          </h2>
          <DropFileInput
            uploadFiles={this.uploadFiles}
            filesList = {this.state.files_list}
          />
          <button
            className="button"
            onClick={this.handleSubmit}
          >
            Summarize now
          </button>
          <MessageBox state={this.state.noFilesMsgBox}>
            <p>Please upload files first</p>
            <button 
              onClick={()=>this.setState({noFilesMsgBox: false})}
            >
              close
            </button>
          </MessageBox>
          <MessageBox state={this.state.filesMsgBox}>
            <p>Files are successfully submitted!</p>
            <button
              className="msg-button"
              onClick={()=>this.setState({filesMsgBox: false})}
            >
              close
            </button>
          </MessageBox>
        </div>
      </div>
    )
  }
}