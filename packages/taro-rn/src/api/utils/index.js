import { Permissions } from 'expo'

export async function askAsyncPermissions (PermissionsType) {
  const { status } = await Permissions.askAsync(PermissionsType)
  return status
}
