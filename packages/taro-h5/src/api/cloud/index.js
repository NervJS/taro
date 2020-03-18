const TcbSdk = require('tcb-js-sdk')

function wxCloud() {
  const wxC = TcbSdk || {}
  const wxcloud = {}
  const apiList = [
    'init',
    'auth',
    'database',
    'uploadFile',
    'downloadFile',
    'getTempFileURL',
    'deleteFile',
    'callFunction'
    // 'CloudID'
  ]
  apiList.forEach(v => {
    wxcloud[v] = wxC[v]
  })

  console.log('wxcloud :', wxcloud);
  return wxcloud
}


export const cloud = wxCloud()

