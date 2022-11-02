const RNCCameraRoll = {
  deletePhotos: jest.fn(),
  saveToCameraRoll: jest.fn((url, { type }) => Promise.resolve(`${type}://${url}`)),
  getPhotos: jest.fn(() => Promise.resolve()),
}
const RNCCameraRollPermissionModule = {
  checkPermission: jest.fn(),
  requestReadWritePermission: jest.fn(),
  requestAddOnlyPermission: jest.fn(),
  refreshPhotoSelection: jest.fn(),
}

export default {
  RNCCameraRoll,
  RNCCameraRollPermissionModule,
}
