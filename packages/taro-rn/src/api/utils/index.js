import { Permissions } from 'expo'

export function generateUnSupportApi (errText, fnNames) {
  const res = {}
  fnNames.forEach((fnName) => {
    res[fnName] = function () {
      throw new Error(`${errText} ##  ${JSON.stringify(arguments)}`)
    }
  })
  return res
}

export async function askAsyncPermissions (PermissionsType) {
  const { status } = await Permissions.askAsync(PermissionsType)
  return status
}
