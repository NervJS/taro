export default (ctx, opts) => {
  ctx.registerPlatform({
    name: 'weapp',
    fileType: {
      templ: '.wxml',
      style: '.wxss',
      config: '.json',
      script: '.js'
    },
    fn () {
      // build weapp
      console.log('build weapp')
    }
  })
}
