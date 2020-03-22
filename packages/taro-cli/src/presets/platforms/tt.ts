export default (ctx, opts) => {
  ctx.registerPlatform({
    name: 'tt',
    fn () {
      // build tt
      console.log('build tt')
    }
  })
}