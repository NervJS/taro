export default (ctx, opts) => {
  ctx.registerPlatform({
    name: 'weapp',
    useConfigName: 'mini',
    fileType: {
      templ: '.wxml',
      style: '.wxss',
      config: '.json',
      script: '.js'
    },
    fn (passed, opts) {
      console.log(ctx, opts)
      // build weapp
      console.log('build weapp')
    }
  })
}
