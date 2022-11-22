import axios from 'axios'

export default class BaseAPI{
  _sendAxiosRequest(reqType, url, payload){
    let method = null;
    let callMethod = null;
    if (reqType==="get") method = axios.get;
    else if(reqType==="post") method = axios.post;
    else if(reqType==="put") method = axios.put;
    else if(reqType==="delete") method = axios.delete;
    else if (reqType==="patch") method = axios.patch;

    return new Promise((res, rej) => {
      if (payload){
        callMethod = () => method(url, payload)
      }
      else{
        if (reqType!=="get" && reqType!=="delete"){
          rej(new Error(`Requests of type ${reqType} must contain payload. If you want to provide empty payload call with {}`))
        }
        else
          callMethod = () => method(url)
      }
      callMethod()
      .then((resp)=>{
        res(resp)
      })
      .catch((err)=>{
        rej(err)
      })
    })
  }
}