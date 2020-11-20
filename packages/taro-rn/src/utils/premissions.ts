import { Permissions } from 'react-native-unimodules'

export async function askAsyncPermissions (PermissionsType: Permissions.PermissionType): Promise<string> {
  const { status } = await Permissions.askAsync(PermissionsType)
  return status
}
