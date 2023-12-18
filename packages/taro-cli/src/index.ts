import Creator from './create/creator'
import Project from './create/project'
import doctor from './doctor'
import { getRootPath } from './util'
import { type ConfigEnv, type UserConfigExport, type UserConfigFn, defineConfig } from './util/defineConfig'

export default {
  doctor,
  Project,
  Creator,
  defineConfig,
  getRootPath
}

export {
  type ConfigEnv,
  type UserConfigExport,
  type UserConfigFn,
  Creator,
  defineConfig,
  doctor,
  getRootPath,
  Project }
