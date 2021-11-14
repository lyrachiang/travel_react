import axios from 'axios';
import jsSHA from 'jssha';

function getAuthorizationHeader() {
  const AppID  = process.env.REACT_APP_APP_ID;
  const AppKey = process.env.REACT_APP_APP_KEY;

  const GMTString = new Date().toGMTString();

  let objSha = new jsSHA('SHA-1', 'TEXT');
  objSha.setHMACKey(AppKey, 'TEXT');
  objSha.update('x-date: ' + GMTString);

  const HMAC = objSha.getHMAC('B64');
  const Authorization = 'hmac username="' + AppID + '", algorithm="hmac-sha1", headers="x-date", signature="' + HMAC + '"';
  
  return { 'Authorization': Authorization, 'X-Date': GMTString }; 
}

class Api {
  get(uri, request) {
    const param = [];
    
    Object.keys(request).forEach((key, idx) => {
      if (request[key]) {
        param.push(`${key}=${request[key]}`);
      }
    });

    param.push('$format=JSON');

    return axios.get(
      process.env.REACT_APP_API_HOST + uri + '?' + param.join('&'),
      {
         headers: getAuthorizationHeader()
      }
    );
  }
}

export default new Api();