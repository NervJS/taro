export default (ctx) => {
  ctx.registerCommand({
    name: 'init',
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