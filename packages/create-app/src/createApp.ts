import * as minimist from 'minimist'
import { Project } from '@tarojs/cli'

export function init () {
  const argv = minimist(process.argv.slice(2), {
    alias: {
      typescript: ['ts']
    },
    boolean: ['typescript']
  })
  const projectName: string | undefined = argv._[0]
  const typescript: boolean | undefined = argv.typescript || undefined
  const appPath = process.cwd()

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
