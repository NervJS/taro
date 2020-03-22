export default (ctx, opts) => {
  ctx.registerPlatform({
    name: 'alipay',
    fn () {
      // build alipay
      console.log('build alipay')
    }
  })
}