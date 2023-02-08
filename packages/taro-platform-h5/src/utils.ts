import * as resolve from 'resolve'

export function resolveSync (id: string, opts: resolve.SyncOpts = {
  basedir: __dirname
}) {
  return resolve.sync(id, opts)
}
