export default {
  pages: [
    'pages/index/index'
  ],
  "subpackages": [
    {
      "root": "packageA",
      "pages": [
        "pages/cat/index",
        "pages/dog/index"
      ]
    }, {
      "root": "packageB",
      "name": "pack2",
      "pages": [
        "pages/apple/index",
        "pages/banana/index"
      ]
    }
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
}
