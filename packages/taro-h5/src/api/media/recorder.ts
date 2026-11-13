import Taro from '@tarojs/api'

import { temporarilyNotSupport } from '../../utils'
import { CallbackManager } from '../../utils/handler'

// 录音
export const stopRecord = /* @__PURE__ */ temporarilyNotSupport('stopRecord')
export const startRecord = /* @__PURE__ */ temporarilyNotSupport('startRecord')

type StartOption = Taro.RecorderManager.StartOption

interface Recording {
  recorder?: MediaRecorder
  stream?: MediaStream
  timer?: ReturnType<typeof setTimeout>
  elapsed: number
  remaining: number
  startedAt?: number
}

const formatTypes: Record<keyof Taro.RecorderManager.Format, string[]> = {
  mp3: ['audio/mpeg'],
  aac: ['audio/aac', 'audio/mp4;codecs=mp4a.40.2'],
  wav: ['audio/wav'],
  PCM: ['audio/pcm'],
}

class RecorderManager implements Taro.RecorderManager {
  private recording?: Recording
  private readonly startListeners = new CallbackManager<[TaroGeneral.CallbackResult]>()
  private readonly stopListeners = new CallbackManager<[Taro.RecorderManager.OnStopCallbackResult]>()
  private readonly pauseListeners = new CallbackManager<[TaroGeneral.CallbackResult]>()
  private readonly resumeListeners = new CallbackManager<[TaroGeneral.CallbackResult]>()
  private readonly errorListeners = new CallbackManager<[Taro.RecorderManager.OnErrorCallbackResult]>()

  onStart = this.startListeners.add
  onStop = this.stopListeners.add
  onPause = this.pauseListeners.add
  onResume = this.resumeListeners.add
  onError = this.errorListeners.add

  onFrameRecorded (_callback: Taro.RecorderManager.OnFrameRecordedCallback) {
    // The browser does not emit MP3 frames.
  }

  onInterruptionBegin (_callback: (res: TaroGeneral.CallbackResult) => void) {
    // The browser does not expose the mini-program interruption event.
  }

  onInterruptionEnd (_callback: (res: TaroGeneral.CallbackResult) => void) {
    // The browser does not expose the mini-program interruption event.
  }

  start (options: StartOption = {}) {
    if (this.recording) {
      this.reportError('a recording is already in progress')
      return
    }

    const recording: Recording = { elapsed: 0, remaining: 0 }
    this.recording = recording
    this.startRecording(recording, options)
  }

  private async startRecording (recording: Recording, options: StartOption) {
    try {
      if (typeof MediaRecorder === 'undefined' || typeof navigator === 'undefined' ||
        !navigator.mediaDevices?.getUserMedia) {
        throw new Error('browser audio recording is not available')
      }

      const { duration = 60000, format, audioSource, frameSize, sampleRate, numberOfChannels, encodeBitRate } = options
      if (!Number.isFinite(duration) || duration <= 0 || duration > 600000) {
        throw new Error('duration must be greater than 0 and at most 600000 ms')
      }
      if (frameSize !== undefined || (audioSource !== undefined && audioSource !== 'auto' && audioSource !== 'mic')) {
        throw new Error('frameSize or the requested audioSource is not supported on H5')
      }

      const mimeType = format === undefined
        ? undefined
        : formatTypes[format]?.find(type => MediaRecorder.isTypeSupported(type))
      if (format !== undefined && !mimeType) {
        throw new Error(`format ${format} is not supported by this browser`)
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { sampleRate, channelCount: numberOfChannels },
      })
      if (this.recording !== recording) {
        stream.getTracks().forEach(track => track.stop())
        return
      }

      recording.stream = stream
      const recorder = new MediaRecorder(stream, { mimeType, audioBitsPerSecond: encodeBitRate })
      recording.recorder = recorder
      const chunks: Blob[] = []
      recorder.addEventListener('dataavailable', ({ data }) => {
        if (data.size) chunks.push(data)
      })
      recorder.addEventListener('start', () => this.startListeners.trigger({ errMsg: 'RecorderManager.start:ok' }))
      recorder.addEventListener('pause', () => this.pauseListeners.trigger({ errMsg: 'RecorderManager.pause:ok' }))
      recorder.addEventListener('resume', () => this.resumeListeners.trigger({ errMsg: 'RecorderManager.resume:ok' }))
      recorder.addEventListener('error', event => {
        if (this.recording !== recording) return
        this.release(recording)
        this.reportError((event as Event & { error?: DOMException }).error || 'browser recording failed')
      })
      recorder.addEventListener('stop', () => {
        if (this.recording !== recording) return
        this.release(recording)
        const file = new Blob(chunks, { type: recorder.mimeType || chunks[0]?.type })
        if (!file.size) {
          this.reportError('the recording did not produce audio')
          return
        }
        this.stopListeners.trigger({
          duration: Math.round(recording.elapsed),
          fileSize: file.size,
          tempFilePath: URL.createObjectURL(file),
        })
      })

      recorder.start()
      this.startTimer(recording, duration)
    } catch (error) {
      if (this.recording !== recording) return
      this.release(recording)
      this.reportError(error)
    }
  }

  pause () {
    const recording = this.recording
    if (recording?.recorder?.state !== 'recording') return
    recording.recorder.pause()
    this.stopTimer(recording)
  }

  resume () {
    const recording = this.recording
    if (recording?.recorder?.state !== 'paused') return
    recording.recorder.resume()
    this.startTimer(recording, recording.remaining)
  }

  stop () {
    const recording = this.recording
    if (!recording) return
    if (!recording.recorder) {
      this.release(recording)
    } else if (recording.recorder.state !== 'inactive') {
      this.stopTimer(recording)
      recording.recorder.stop()
    }
  }

  private startTimer (recording: Recording, remaining: number) {
    recording.remaining = remaining
    recording.startedAt = performance.now()
    recording.timer = setTimeout(() => this.stop(), remaining)
  }

  private stopTimer (recording: Recording) {
    clearTimeout(recording.timer)
    if (recording.startedAt !== undefined) {
      const elapsed = performance.now() - recording.startedAt
      recording.elapsed += elapsed
      recording.remaining = Math.max(0, recording.remaining - elapsed)
      recording.startedAt = undefined
    }
  }

  private release (recording: Recording) {
    this.stopTimer(recording)
    recording.stream?.getTracks().forEach(track => track.stop())
    this.recording = undefined
  }

  private reportError (error: unknown) {
    const message = error instanceof Error || error instanceof DOMException ? error.message : String(error)
    this.errorListeners.trigger({ errMsg: `RecorderManager:fail ${message}` })
  }
}

let recorderManager: RecorderManager | undefined

export const getRecorderManager: typeof Taro.getRecorderManager = () => (recorderManager ||= new RecorderManager())
