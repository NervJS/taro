import MyHarmony from './program'

export default (ctx) => {
  // 注册编译平台
  ctx.registerPlatform({
    name: 'myHarmony',
    useConfigName: 'mini',
    async fn ({ config }) {
      // 调用自定义平台类的 start 函数，开始端平台编译
      const program = new MyHarmony(ctx, config)
      await program.start()
    }
  })
}
