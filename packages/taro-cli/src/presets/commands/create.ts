export default (ctx) => {
  ctx.registerCommand({
    name: 'create',
    fn () {
      const {
        type,
        name,
        description
      } = ctx.runOpts
      const { chalk } = ctx.helper
      const { appPath } = ctx.paths
      if (typeof name !== 'string') {
        return console.log(chalk.red('请输入需要创建的页面名称'))
      }
      if (type === 'page') {
        const Page = require('../../create/page').default
        const page = new Page({
          pageName: name,
          projectDir: appPath,
          description
        })
      
        page.create()
      }
    }
  })
}