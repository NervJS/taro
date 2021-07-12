import { options } from '../options'

export function getBoundingClientRectImpl (): Promise<null> {
  if (!options.miniGlobal) return Promise.resolve(null)
  return new Promise(resolve => {
    const query = options.miniGlobal.createSelectorQuery()
    query.select(`#${this.uid}`).boundingClientRect(res => {
      resolve(res)
    }).exec()
  })
}
