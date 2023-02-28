interface Location {
  line: number
  column: number
  file: string
}

export default function reporterSkip ({ skipRows, filename }) {
  return {
    postcssPlugin: 'postcss-reporter-skip',
    // @ts-ignore
    Once (css, result) {
      result.messages?.forEach((message: any) => {
        const { line, column, node } = message

        const messageInput = node?.source?.input
        if (messageInput) {
          const originLocation: Location = messageInput.origin(line, column)
          // 如果是原始引入的样式文件，则对拼接的代码（addionalData）函数做减法
          if (originLocation && originLocation.file.includes(filename)) {
            // force modify line，then source map cannot read origin column, value is 0.
            message.line -= skipRows
          }
        }
      })
    }
  }
}
