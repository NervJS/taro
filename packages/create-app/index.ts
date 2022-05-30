#!/usr/bin/env node

import * as minimist from 'minimist'
import { init } from './createApp'
import { printPkgVersion } from './util'

const argv = minimist(process.argv.slice(2), {
  boolean: ['typescript', 'ts']
})
const projectName: string | undefined = argv._[0]
const typescript: boolean | undefined = argv.typescript || argv.ts || undefined

printPkgVersion()
init({
  projectName,
  typescript
})
