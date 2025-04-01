const { exec } = require('child_process')
const axios = require('axios')

axios.get('https://taro.jd.com/', { timeout: 5000 })
  .then(() => {
    // JD内网
    console.log('*******JD内网:*******', process.cwd())
    exec('taro global-config add-plugin  @jdtaro/plugin-report-performance-data@latest --registry http://registry.m.jd.com', (error, stdout, stderr) => {
      if (error) {
        console.error(`执行错误: ${error}`)
        return
      }
      console.log(`stdout:{\n ${stdout} \n}`)
      console.log(`stderr:{\n ${stderr} \n}`)
    })
  })
  .catch(() => {
    // 公网
    console.log('*******公网:*******')
  })
