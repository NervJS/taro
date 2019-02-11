import Taro from '@tarojs/taro'

const POST = (url, params = {}, token) => new Promise((resolve, reject) => {
  Taro.request({
    url: url,
    body: JSON.stringify(params),
    header: {
      'Content-Type': 'application/json;'
    },
    method: 'POST'
  })
    .then((e) => {
      resolve(e)
    })
    .catch((e) => {
      resolve(e)
    })
})

export default {
  POST
}
