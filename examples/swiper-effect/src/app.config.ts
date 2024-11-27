export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/effect-cube/index',
    'pages/effect-flip/index',
    'pages/effect-card/index',
    'pages/effect-fade/index',
    'pages/effect-coverflow/index',
    'pages/effect-creative/index',
    'pages/effect/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
    navigationStyle: 'default'
  },
  animation: false,
  tabBar:{
    list:[
      {
        pagePath:'pages/index/index',
        text:'常规用法',
      },
      {
        pagePath:'pages/effect/index',
        text:'effect',
      }
    ]
  }
})
