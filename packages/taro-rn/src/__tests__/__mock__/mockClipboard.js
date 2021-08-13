class Clipboard {
  constructor () {
    this.clipboardData = ''
  }

  setString (str) {
    this.clipboardData = str
  }

  getString () {
    return Promise.resolve(this.clipboardData)
  }
}

export default Clipboard
