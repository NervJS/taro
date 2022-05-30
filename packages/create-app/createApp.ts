import { Project } from '@tarojs/cli'

export function init (options) {
  const appPath = process.cwd()
  const { projectName, typescript } = options
  const project = new Project({
    projectName,
    projectDir: appPath,
    description: undefined,
    templateSource: undefined,
    css: undefined,
    clone: undefined,
    template: undefined,
    typescript
  })

  project.create()
}
