import { chooseMedia as chooseMediaAlbum } from './chooseMedia'
import { chooseMedium as chooseMediaPicker } from './chooseMedium'

export const chooseMedia = (options: any, usePicker: boolean = true) => {
  return usePicker ? chooseMediaPicker(options) : chooseMediaAlbum(options)
}
