const CameraRoll = {
  save: jest.fn((url, { type }) => Promise.resolve(`${type}://${url}`)),
}

export default {
  CameraRoll,
}
