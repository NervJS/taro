export const mockGetCurrentPosition = jest.fn()

const RNCGeolocation  = {
    addListener: jest.fn(),
    getCurrentPosition: mockGetCurrentPosition,
    removeListeners: jest.fn(),
    requestAuthorization: jest.fn(),
    setConfiguration: jest.fn(),
    startObserving: jest.fn(),
    stopObserving: jest.fn(),
}

export default RNCGeolocation
