export default (ctx, opts) => {
  ctx.registerPlatform({
    name: 'weapp',
    fn () {
      // build weapp
      console.log('build weapp')
    }
  })
}