export default (ctx) => {
  ctx.registerPlatform({
    name: 'ui',
    async fn () {
      console.log('ui')
    }
  })
}