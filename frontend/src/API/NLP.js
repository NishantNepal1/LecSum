import axios from 'axios'
import BaseAPI from './base.js'

export class NLPapi extends BaseAPI {
  constructor(props) {
    super(props)
    this.baseUrl = `http://localhost:3001/lecsum/api`
    // this.baseUrl = `http://localhost:3000/`
  }

  // **** API for Downloading Summarized File ****
  getFiles = () => {
    return this._sendAxiosRequest("get", `${this.baseUrl}`, null, true)
  }


  downloadFiles = (object) => {
    return axios.post(`${this.baseUrl}download-result`, object, {headers: null, responseType: 'blob' })
  }

  
  // Test route for REST.API from django
  testGetRoute = async () => {
    try {
      const res = (await axios.get(`${this.baseUrl}/getFile/?id=123456`)).data;
      console.log(res);
    } catch (e) {
      console.error(e);
    }
  }
x
  testPostRoute = async (files_list) => {
    try {
      // creating new form data instance
      let fd = new FormData();

      // mapping from list to form data
      files_list.forEach((element, index) => {
        fd.append(`file${index}`, element);
      });

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }

      const id = 2022;

      // testing
      const res = await axios({
        method: 'post',
        url: `${this.baseUrl}/sendFiles/?id=${id}`,
        data: fd,
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      // const res = await axios.post(`${this.baseUrl}/sendFiles/?id=${id}`, fd, config);
      console.log(res?.data)
    } catch (e) {
      console.error(e)
    }
  }
}