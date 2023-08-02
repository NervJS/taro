export const TestConsole = {
  consoleTest: (apiName: string) => {
    console.log(
      `\n%c------------------------------start test [${apiName}]------------------------------`,
      'color:blue;font-weight:bold'
    )
  },

  consoleSuccess: (res: any) => {
    console.log('%csuccess:\n', 'color:green;font-weight:bold', res)
  },

  consoleFail: (res: any) => {
    console.log('%cfail:\n', 'color:red;font-weight:bold', res)
  },

  consoleComplete: (res: any) => {
    console.log('%ccomplete:\n', 'color:black;font-weight:bold', res)
  },

  consoleReturn: (res: any) => {
    console.log('%creturn:\n', 'color:blue;font-weight:bold', res)
  },

  consoleNormal: (name: string, data?: any) => {
    if (data) {
      console.log(`%c${name}:\n`, 'color:gray;font-weight:bold', data)
    } else {
      console.log(`%c${name}`, 'color:gray;font-weight:bold')
    }
  },

  consoleDebug: (name: string, errMsg?: any) => {
    console.warn('debug:\n', name, ':', errMsg)
  },
}
