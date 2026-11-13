import { getRecorderManager } from '@tarojs/taro-h5'

class FakeRecorder extends EventTarget {
  static isTypeSupported = (type: string) => type === 'audio/mp4;codecs=mp4a.40.2'
  static latest: FakeRecorder

  readonly mimeType = 'audio/webm;codecs=opus'
  state: RecordingState = 'inactive'

  constructor () {
    super()
    FakeRecorder.latest = this
  }

  start () {
    this.state = 'recording'
    queueMicrotask(() => this.dispatchEvent(new Event('start')))
  }

  pause () {
    this.state = 'paused'
    this.dispatchEvent(new Event('pause'))
  }

  resume () {
    this.state = 'recording'
    this.dispatchEvent(new Event('resume'))
  }

  stop () {
    this.state = 'inactive'
    this.dispatchEvent(Object.assign(new Event('dataavailable'), { data: new Blob(['audio']) }))
    this.dispatchEvent(new Event('stop'))
  }
}

const manager = getRecorderManager()
const stopTrack = jest.fn()
const getUserMedia = jest.fn()
const createObjectURL = jest.fn()
const onError = jest.fn()
const onStop = jest.fn()
const onStart = jest.fn()
const onPause = jest.fn()
const onResume = jest.fn()
const tick = async () => {
  await Promise.resolve()
  await Promise.resolve()
}

beforeAll(() => {
  manager.onError(onError)
  manager.onStop(onStop)
  manager.onStart(onStart)
  manager.onPause(onPause)
  manager.onResume(onResume)
})

const originalMediaDevices = Object.getOwnPropertyDescriptor(navigator, 'mediaDevices')
const originalRecorder = Object.getOwnPropertyDescriptor(window, 'MediaRecorder')
const originalCreateObjectURL = Object.getOwnPropertyDescriptor(URL, 'createObjectURL')

beforeEach(() => {
  jest.clearAllMocks()
  jest.useFakeTimers({ doNotFake: ['queueMicrotask'] })
  getUserMedia.mockReset().mockResolvedValue({ getTracks: () => [{ stop: stopTrack }] })
  createObjectURL.mockReturnValue('blob:recording')
  Object.defineProperty(navigator, 'mediaDevices', { configurable: true, value: { getUserMedia } })
  Object.defineProperty(window, 'MediaRecorder', { configurable: true, value: FakeRecorder })
  Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: createObjectURL })
})

afterEach(() => {
  manager.stop()
  jest.useRealTimers()
  for (const [target, key, descriptor] of [
    [navigator, 'mediaDevices', originalMediaDevices],
    [window, 'MediaRecorder', originalRecorder],
    [URL, 'createObjectURL', originalCreateObjectURL],
  ] as const) {
    if (descriptor) Object.defineProperty(target, key, descriptor)
    else Reflect.deleteProperty(target, key)
  }
})

it('keeps one manager and records the requested active duration across pause and resume', async () => {
  expect(getRecorderManager()).toBe(manager)
  manager.start({ duration: 100 })
  await tick()
  expect(onStart).toHaveBeenCalledTimes(1)
  jest.advanceTimersByTime(40)
  manager.pause()
  jest.advanceTimersByTime(200)
  expect(onPause).toHaveBeenCalledTimes(1)
  expect(onStop).not.toHaveBeenCalled()

  manager.resume()
  expect(onResume).toHaveBeenCalledTimes(1)
  jest.advanceTimersByTime(59)
  expect(onStop).not.toHaveBeenCalled()
  jest.advanceTimersByTime(1)

  expect(stopTrack).toHaveBeenCalledTimes(1)
  expect(onStop).toHaveBeenCalledWith({ duration: 100, fileSize: 5, tempFilePath: 'blob:recording' })
  expect(createObjectURL.mock.calls[0][0].type).toBe('audio/webm;codecs=opus')
})

it('releases a late stream after stop and allows another recording', async () => {
  let resolvePermission!: (stream: unknown) => void
  getUserMedia.mockReturnValueOnce(new Promise(resolve => { resolvePermission = resolve }))
  manager.start({})
  manager.stop()
  manager.start({})
  await tick()
  const releaseLateStream = jest.fn()
  resolvePermission({ getTracks: () => [{ stop: releaseLateStream }] })
  await tick()

  expect(onStart).toHaveBeenCalledTimes(1)
  expect(releaseLateStream).toHaveBeenCalledTimes(1)
  expect(stopTrack).not.toHaveBeenCalled()
  manager.stop()
  expect(stopTrack).toHaveBeenCalledTimes(1)
  expect(onStop).toHaveBeenCalledTimes(1)
})

it('reports unsupported formats and microphone permission errors', async () => {
  manager.start({ format: 'mp3' })
  expect(getUserMedia).not.toHaveBeenCalled()
  expect(onError).toHaveBeenCalledWith({ errMsg: 'RecorderManager:fail format mp3 is not supported by this browser' })

  getUserMedia.mockRejectedValueOnce(new DOMException('Permission denied', 'NotAllowedError'))
  manager.start({})
  await tick()
  expect(onError).toHaveBeenCalledWith({ errMsg: 'RecorderManager:fail Permission denied' })
  expect(onStop).not.toHaveBeenCalled()
})

it('releases the microphone once on a recording error', async () => {
  manager.start({})
  await tick()
  FakeRecorder.latest.dispatchEvent(new Event('error'))
  FakeRecorder.latest.stop()

  expect(stopTrack).toHaveBeenCalledTimes(1)
  expect(onError).toHaveBeenCalledWith({ errMsg: 'RecorderManager:fail browser recording failed' })
  expect(onStop).not.toHaveBeenCalled()
})
