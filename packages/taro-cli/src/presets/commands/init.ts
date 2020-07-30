export default (ctx) => {
  ctx.registerCommand({
    name: 'init',
    optionsMap: {
      '--name [name]': '项目名称',
      '--description [description]': '项目介绍',
      '--typescript': '使用TypeScript',
      '--no-typescript': '使用TypeScript',
      '--template-source [templateSource]': '项目模板源',
      '--clone [clone]': '拉取远程模板时使用git clone',
      '--template [template]': '项目模板',
      '--css [css]': 'CSS预处理器(sass/less/stylus/none)',
      '-h, --help': 'output usage information'
    },
    async fn () {
      // init project
      const { appPath } = ctx.paths
      const { projectName, templateSource, clone, template, description, typescript, css } = ctx.runOpts
      const Project = require('../../create/project').default
      const project = new Project({
        projectName,
        projectDir: appPath,
        templateSource,
        clone,
        template,
        description,
        typescript,
        css
      })

      project.create()
    }
  })
}
