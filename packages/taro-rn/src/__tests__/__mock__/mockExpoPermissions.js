export const CAMERA = 'camera'
export const CAMERA_ROLL = 'cameraRoll'
export const LOCATION = 'location'
export const askAsync = jest.fn().mockImplementation((permissionType) => {
  const hasPermission = [CAMERA, CAMERA_ROLL, LOCATION].includes(permissionType)
  const responseData = hasPermission ? { status: 'granted' } : { status: 'undetermined' } // you could also pass `denied` instead of `undetermined`
  return Promise.resolve(responseData)
})
