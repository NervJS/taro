import type { IPluginContext } from '@tarojs/service'

export default (ctx: IPluginContext) => {
  ctx.registerCommand({
    name: 'init',
    optionsMap: {
      '--name [name]': '项目名称',
      '--description [description]': '项目介绍',
      '--typescript': '使用TypeScript',
      '--build-es5': '是否需要编译为es5',
      '--npm [npm]': '包管理工具',
      '--template-source [templateSource]': '项目模板源',
      '--clone [clone]': '拉取远程模板时使用git clone',
      '--template [template]': '项目模板',
      '--css [css]': 'CSS预处理器(sass/less/stylus/none)',
      '--autoInstall': '自动安装依赖',
      '-h, --help': 'output usage information'
    },
    async fn (opts) {
      // init project
      const { appPath } = ctx.paths
      const {
        projectName,
        templateSource,
        clone,
        template,
        description,
        typescript,
        buildEs5,
        css,
        npm,
        framework,
        compiler,
        hideDefaultTemplate,
        sourceRoot,
        autoInstall,
        ask
      } = opts.options

      const Project = require('../../create/project').default
      const project = new Project({
        sourceRoot,
        projectName,
        projectDir: appPath,
        npm,
        templateSource,
        clone,
        template,
        description,
        typescript,
        buildEs5,
        framework,
        compiler,
        hideDefaultTemplate,
        autoInstall,
        css,
        ask
      })

      project.create()
    }
  })
}
