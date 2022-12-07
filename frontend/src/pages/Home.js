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
      downloadFailMsgBox: false,
      files_list: [],
      downloadLink: null,
      file_download_fail: "",
      clicked: false,
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

  
  ButtonClick = async (e) => {
    e.preventDefault();

    if (this.state.files_list.length < 1)
      return;

    try {
      const downloadLink = await this.nlp.testPostRoute(this.state.files_list);
      const res = downloadLink?.success ? downloadLink.downloadLink?.filePath : null;
      this.setState({downloadLink: res})
      console.log("downloadLink:\t", downloadLink)
      // this.nlp.testGetRoute();
    } catch (e) {
      console.error(e)
    }
  }

  downloadFile = async () => {
    // console.log(this.state.downloadLink)
    try {
      const res = await this.nlp.downloadPdf(`${this.state.downloadLink}.pdf`)
      // console.log(res)
      if (res?.failure) {
        this.setState({file_download_fail: res?.text})
        this.setState({downloadFailMsgBox: true})
      }

    } catch (e) {
      console.error(e)
    }
  }


  render(){
    return(
      <div className="main-view">
        <div className="main-container">
          <div id = "main_btn" className={`main_btn ${this.state.clicked ? "animation_btn loader": `sum-button slide-in-bck-center`}`}
            onClick={(e) =>  {
              e.preventDefault();
              
              console.log(document.getElementById("main_btn").classList.remove('slide-in-bck-center'))

              console.log('click')
              this.setState({clicked: true});

              setTimeout(() => {
                this.setState({clicked: false});
              }, 1000);
            }}
          >
            {
              !this.state.clicked 
              &&
              <div className="sum-button-inner">
                Summarize
              </div>
            }
            
          </div>
          <div className="frame frame1 slide-in-top">
            <div className="frame-1-1">
              <DropFileInput
                uploadFiles={this.uploadFiles}
                filesList = {this.state.files_list}
              />
            </div>
          </div>

          <div className="frame frame2 slide-in-right">
            <div className="frame-2-1">
              <h2>We need to list items here</h2>
            </div>
          </div>

          <div className="frame frame3 slide-in-left">
            <div className="frame-2-1">
              <h2>We need loading animation, and download link</h2>
            </div>
          </div>
        </div>
        <div className="description ">
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
            className="button spinning"
            onClick={this.ButtonClick}
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
          <MessageBox state={this.state.downloadFailMsgBox}>
            <p>{this.state.file_download_fail}</p>
            <button 
              onClick={()=>this.setState({downloadFailMsgBox: false})}
            >
              close
            </button>
          </MessageBox>
        </div>
        <div className="box">
          <h2>{`${this.state.downloadLink ? "Your summarization is ready" : ""}`}</h2> 
        </div>

        <button
            className="button"
            onClick={this.downloadFile}
          >
            Download Summarization
          </button>
      </div>
    )
  }
}