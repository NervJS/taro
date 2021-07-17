import { IPluginContext } from '@tarojs/service'

function supplementBlank (length) {
  return Array(length).map(() => '').join(' ')
}

export function printHelpLog (command, optionsList: Map<string, string>, synopsisList?: Set<string>) {
  console.log(`Usage: taro ${command} [options]`)
  console.log()
  console.log('Options:')
  const keys = Array.from(optionsList.keys())
  const maxLength = keys.reduce((v1, v2) => {
    return v1.length > v2.length ? v1 : v2
  }).length + 3
  optionsList.forEach((v, k) => {
    const supplementBlankLength = maxLength - k.length
    console.log(`  ${k}${supplementBlank(supplementBlankLength)}${v}`)
  })
  if (synopsisList && synopsisList.size) {
    console.log()
    console.log('Synopsis:')
    synopsisList.forEach(item => {
      console.log(`  $ ${item}`)
    })
  }
}

export default (ctx: IPluginContext) => {
  ctx.registerCommand({
    name: 'help',
    synopsisList: [
      'taro -h',
      'taro --help'
    ],
    async fn ({ _, options }) {
      const command = ctx.ctx.commands.get(_[1])
      if (!command) {
        console.log(`命令 taro help ${_[1]} 中 ${_[1]} 不存在，试试 taro -h 再看看呢？`)
        return
      }
      const defaultOptionsMap = new Map()
      defaultOptionsMap.set('-h, --help', 'output usage information')
      let customOptionsMap = new Map(Object.entries(options))
      if (command?.optionsMap) {
        customOptionsMap = new Map(Object.entries(command?.optionsMap))
      }
      const optionsMap = new Map([...customOptionsMap, ...defaultOptionsMap])
      printHelpLog(command.name, optionsMap, command?.synopsisList ? new Set(command?.synopsisList) : new Set())
    }
  })
}
