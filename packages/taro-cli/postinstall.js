const { exec } = require('child_process')
const axios = require('axios')

axios.get('https://taro.jd.com/', { timeout: 5000 })
  .then(() => {
    exec('pwd', (error, _stdout, _stderr) => {
      console.log('pwd-error', error, '_stdout', _stdout, '_stderr', _stderr)
    })
    exec('ls', (error, _stdout, _stderr) => {
      console.log('ls-error', error, '_stdout', _stdout, '_stderr', _stderr)
    })
    exec('./bin/taro global-config add-plugin  @jdtaro/plugin-build-report-performance@latest --registry http://registry.m.jd.com', (error, _stdout, _stderr) => {
      if (error) {
        console.error(`install performance plugin error: ${error}`)
      }
    })
  })
  .catch(() => {
  })
