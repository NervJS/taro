import * as path from 'path'

export default (ctx) => {
  ctx.registerCommand({
    name: 'config',
    fn () {
      const { cmd, key, value, json } = ctx.runOpts
      const { fs, getUserHomeDir, TARO_CONFIG_FLODER, TARO_BASE_CONFIG } = ctx.helper
      const homedir = getUserHomeDir()
      const configPath = path.join(homedir, `${TARO_CONFIG_FLODER}/${TARO_BASE_CONFIG}`)

      if (!homedir) return console.log('找不到用户根目录')

      function displayConfigPath (configPath) {
        console.log('Config path:', configPath)
        console.log()
      }

      switch (cmd) {
        case 'get':
          if (!key) return console.log('Usage: taro config get foo')
          if (fs.existsSync(configPath)) {
            displayConfigPath(configPath)
            const config = fs.readJSONSync(configPath)
            console.log('Key:', key, ', value:', config[key])
          }
          break
        case 'set':
          if (!key || !value) return console.log('Usage: taro config set foo bar')
          
          if (fs.existsSync(configPath)) {
            displayConfigPath(configPath)
            const config = fs.readJSONSync(configPath)
            config[key] = value
            fs.writeJSONSync(configPath, config)
          } else {
            fs.ensureFileSync(configPath)
            fs.writeJSONSync(configPath, {
              [key]: value
            })
          }
          console.log('Set key:', key, ', value:', value)
          break
        case 'delete':
          if (!key) return console.log('Usage: taro config delete foo')

          if (fs.existsSync(configPath)) {
            displayConfigPath(configPath)
            const config = fs.readJSONSync(configPath)
            delete config[key]
            fs.writeJSONSync(configPath, config)
          }
          console.log('Deleted:', key)
          break
        case 'list':
        case 'ls':
          if (fs.existsSync(configPath)) {
            displayConfigPath(configPath)
            console.log('Config info:')
            const config = fs.readJSONSync(configPath)
            if (json) {
              console.log(JSON.stringify(config, null, 2))
            } else {
              for (const key in config) {
                console.log(`${key}=${config[key]}`)
              }
            }
          }
          break
        default:
          break
      }
    }
  })
}
