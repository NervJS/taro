const {
  Android,
  Config,
  Project,
  ProjectSettings,
  Simulator,
  UrlUtils,
  UserSettings,
  Exp
} = require('xdl')

const chalk = require('chalk')
const indent = require('indent-string')
const qr = require('qrcode-terminal')
const readline = require('readline')

const clearConsole = require('./util/clearConsole')
const log = require('./util/log')
const packager = require('./util/packager')

Config.validation.reactNativeVersionWarnings = false
Config.developerTool = 'crna'
Config.offline = true

let dev = true
let projectDir

const options = {
  interactive: true
}

const { stdin } = process
const startWaitingForCommand = () => {
  stdin.setRawMode(true)
  stdin.resume()
  stdin.setEncoding('utf8')
  stdin.on('data', handleKeypress)
}

const stopWaitingForCommand = () => {
  stdin.removeListener('data', handleKeypress)
  stdin.setRawMode(false)
  stdin.resume()
}

let isInteractive = false
if (typeof stdin.setRawMode === 'function') {
  startWaitingForCommand()
  isInteractive = true
}

function onReady () {
  log(chalk.green('Packager started!\n'))
  printServerInfo()
}

// print a nicely formatted message with setup information
async function printServerInfo () {
  await ProjectSettings.readPackagerInfoAsync(projectDir)
  // who knows why qrcode-terminal takes a callback instead of just returning a string
  const address = await UrlUtils.constructManifestUrlAsync(projectDir)
  let emulatorHelp
  if (process.platform === 'darwin') {
    emulatorHelp = `Press ${chalk.bold('a')} (Android) or ${chalk.bold('i')} (iOS) to start an emulator.`
  } else {
    emulatorHelp = `Press ${chalk.bold('a')} to start an Android emulator.`
  }
  qr.generate(address, qrCode => {
    log(`
${indent(qrCode, 2)}
Your app is now running at URL: ${chalk.underline(chalk.cyan(address))}
${chalk.bold('View your app with live reloading:')}
  ${chalk.underline('Android device:')}
    -> Point the Expo app to the QR code above.
       (You'll find the QR scanner on the Projects tab of the app.)
  ${chalk.underline('iOS device:')}
    -> Press ${chalk.bold('s')} to email/text the app URL to your phone.
  ${chalk.underline('Emulator:')}
    -> ${emulatorHelp}
Your phone will need to be on the same local network as this computer.
For links to install the Expo app, please visit ${chalk.underline(chalk.cyan('https://expo.io'))}.
Logs from serving your app will appear here. Press Ctrl+C at any time to stop.`
    )
    printUsage()
  })
}

function printUsage () {
  if (!isInteractive) {
    return
  }
  const { dim, bold } = chalk
  const devMode = dev ? 'development' : 'production'
  const iosInfo = process.platform === 'darwin'
    ? `${dim(`, or`)} i ${dim(`to open iOS emulator.`)}`
    : dim('.')
  log(
    `
 ${dim(`\u203A Press`)} a ${dim(`to open Android device or emulator`)}${iosInfo}
 ${dim(`\u203A Press`)} s ${dim(`to send the app URL to your phone number or email address`)}
 ${dim(`\u203A Press`)} q ${dim(`to display QR code.`)}
 ${dim(`\u203A Press`)} r ${dim(`to restart packager, or`)} R ${dim(`to restart packager and clear cache.`)}
 ${dim(`\u203A Press`)} d ${dim(`to toggle development mode. (current mode: ${bold(devMode)}${chalk.reset.dim(')')}`)}
`
  )
}

const CTRL_C = '\u0003'
const CTRL_D = '\u0004'

async function handleKeypress (key) {
  switch (key) {
    case CTRL_C:
    case CTRL_D:
      process.emit('SIGINT')
      return
    case 'a': {
      clearConsole()
      log.withTimestamp('Starting Android...')
      const { success, error } = await Android.openProjectAsync(projectDir)
      if (!success) {
        log(chalk.red(error.message))
      }
      printUsage()
      return
    }
    case 'i': {
      clearConsole()
      log.withTimestamp('Starting iOS...')
      const localAddress = await UrlUtils.constructManifestUrlAsync(projectDir, {
        hostType: 'localhost'
      })
      const { success, msg } = await Simulator.openUrlInSimulatorSafeAsync(localAddress)
      if (!success) {
        log(chalk.red(msg))
      }
      printUsage()
      return
    }
    case 's': {
      stopWaitingForCommand()
      const lanAddress = await UrlUtils.constructManifestUrlAsync(projectDir, {
        hostType: 'lan'
      })
      const defaultRecipient = await UserSettings.getAsync('sendTo', null)
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      })
      const handleKeypress = (chr, key) => {
        if (key && key.name === 'escape') {
          cleanup()
          cancel()
        }
      }
      const cleanup = () => {
        rl.close()
        process.stdin.removeListener('keypress', handleKeypress)
        startWaitingForCommand()
      }
      const cancel = () => {
        clearConsole()
        printUsage()
      }
      clearConsole()
      process.stdin.addListener('keypress', handleKeypress)
      log('Please enter your phone number or email address (press ESC to cancel) ')
      rl.question(defaultRecipient ? `[default: ${defaultRecipient}]> ` : '> ', async sendTo => {
        cleanup()
        if (!sendTo && defaultRecipient) {
          sendTo = defaultRecipient
        }
        sendTo = sendTo && sendTo.trim()
        if (!sendTo) {
          cancel()
          return
        }
        log.withTimestamp(`Sending ${lanAddress} to ${sendTo}...`)

        let sent = false
        try {
          await Exp.sendAsync(sendTo, lanAddress, true)
          log.withTimestamp(`Sent link successfully.`)
          sent = true
        } catch (err) {
          log.withTimestamp(`Could not send link. ${err}`)
        }
        printUsage()
        if (sent) {
          await UserSettings.setAsync('sendTo', sendTo)
        }
      })
      return
    }
    case 'q':
      clearConsole()
      await printServerInfo()
      return
    case 'r':
    case 'R': {
      clearConsole()
      const reset = key === 'R'
      if (reset) {
        log.withTimestamp('Asking packager to reset its cache...')
      }
      log.withTimestamp('Restarting packager...')
      Project.startAsync(projectDir, { reset })
      return
    }
    case 'd':
      clearConsole()
      dev = !dev
      await ProjectSettings.setAsync(projectDir, { dev })
      log(
        `Packager now running in ${chalk.bold(dev ? 'development' : 'production')}${chalk.reset(` mode.`)}
Please close and reopen the project in the Expo app for the
change to take effect.`
      )
      printUsage()
  }
}

exports.buildProd = function (config) {
  console.log()
  console.log(`Run ${chalk.cyan('expo build:android ')} or ${chalk.cyan('expo build:ios ')} in .rn_temp/ to building standalone apps`)
  console.log(`you can visite ${chalk.underline(chalk.cyan('https://docs.expo.io/versions/latest/distribution/building-standalone-apps'))} for more info`)
  process.exit(1)
}

exports.buildDev = function (config) {
  projectDir = config.projectDir
  packager.run(projectDir, onReady, options, isInteractive)
}
