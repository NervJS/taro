const PuppeteerEnvironment = require('jest-environment-puppeteer')

/**
 * For unit test debug
 */
class CustomEnvironment extends PuppeteerEnvironment {
  async setup () {
    await super.setup()
    // Your setup
  }

  async teardown () {
    // await new Promise((resolve, reject) => {
    //   setTimeout(() => {resolve(1)}, 20000)
    // })
    // Your teardown
    await super.teardown()
  }
}

module.exports = CustomEnvironment
