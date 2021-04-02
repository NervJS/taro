export default {
  pages: [
    'pages/index/index',
    'pages/expo/index',
    'pages/app/index',
    'pages/app/text'
  ],
  subPackages: [
    {
      root: 'package1',
      pages: [
        'pages/sub/test1',
        'pages/sub/app'
      ]
    }],
  tabBar: {
    backgroundColor: '#ffffff',
    color: '#999',
    selectedColor: '#ff552e',
    list: [{
      pagePath: 'pages/index/index',
      iconPath: 'image/icon_component.png',
      selectedIconPath: 'image/icon_component_HL.png',
      text: '首页'
    }, {
      pagePath: 'pages/expo/index',
      iconPath: 'image/icon_API.png',
      selectedIconPath: 'image/icon_API_HL.png',
      text: 'expo'
    }]
  }
}
