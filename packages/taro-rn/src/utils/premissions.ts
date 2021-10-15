import * as Permissions from 'expo-permissions'

export async function askAsyncPermissions (PermissionsType: Permissions.PermissionType): Promise<string> {
  const { status } = await Permissions.askAsync(PermissionsType)
  return status
}
