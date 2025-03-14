import { vibrateLong, vibrateShort } from './vibrate'
import { startAccelerometer, stopAccelerometer } from './accelerometer'
import { handleSetClipboardData, handleGetClipboardData } from './clipboard'
import { handleShowModal, handleShowToast, handleShowActionSheet } from './interactions'

import type { IEtsMethodsOptions } from "../index"

export function handleTaroApis(option: IEtsMethodsOptions) {
  switch (option.name) {
    case 'showModal':
      handleShowModal(option)
      break
    case 'showToast':
      handleShowToast(option)
      break
    case 'showActionSheet':
      handleShowActionSheet(option)
      break
    case 'setClipboardData':
      handleSetClipboardData(option)
      break
    case 'getClipboardData':
      handleGetClipboardData(option)
      break
    case 'vibrateLong':
      vibrateLong(option)
      break
    case 'vibrateShort':
      vibrateShort(option)
      break
    case 'startAccelerometer':
      startAccelerometer(option)
      break
    case 'stopAccelerometer':
      stopAccelerometer(option)
      break
  }
}