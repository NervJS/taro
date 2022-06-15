export class PreBundle {
  constructor (public env: string = process.env.TARO_ENV || 'h5') {
    this.env = env
  }

  async run (opt: any) {
    let func
    switch (this.env) {
      case 'h5':
        func = await import('./index.h5')
        break
      default:
        func = await import('./index.mini')
    }
    func.preBundle(opt)
  }
}

export default new PreBundle()
