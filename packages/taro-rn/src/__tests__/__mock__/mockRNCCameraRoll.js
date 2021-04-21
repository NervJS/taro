const RNCCameraRoll = {
  deletePhotos: jest.fn(),
  saveToCameraRoll: jest.fn((url, { type }) => Promise.resolve(`${type}://${url}`)),
  getPhotos: jest.fn(() => Promise.resolve()),
}

export default RNCCameraRoll
