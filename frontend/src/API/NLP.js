import axios from 'axios'
import BaseAPI from './base.js'

export class NLPapi extends BaseAPI {
  constructor(props) {
    super(props)
    this.baseUrl = `http://localhost:3000/`
  }

  // **** API for Downloading Summarized File ****
  getFiles = () => {
    return this._sendAxiosRequest("get", `${this.baseUrl}`, null, true)
  }
  downloadFiles = (object) => {
    return axios.post(`${this.baseUrl}download-result`, object, {headers: null, responseType: 'blob' })
  }
}