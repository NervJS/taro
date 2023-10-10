function setCallbackRes(res, type, apiIndex) {
  if (apiIndex != -1) {
    const apiList = this.state.list
    if (apiList[apiIndex].callbackRes == null) {
      apiList[apiIndex].callbackRes = {}
    }
    apiList[apiIndex].callbackRes[type] = res
    this.setState({
      list: apiList,
    })
  }
}

export const TestConsole = {
  consoleTest: (apiName: string) => {
    console.log(
      `\n%c------------------------------start test [${apiName}]------------------------------`,
      'color:blue;font-weight:bold'
    )
  },
  consoleSuccess: function (res, apiIndex = -1) {
    console.log('%csuccess:\n', 'color:green;font-weight:bold', res)
    setCallbackRes.call(this, res, 'success', apiIndex)
  },
  consoleFail: function (res, apiIndex = -1) {
    console.log('%cfail:\n', 'color:red;font-weight:bold', res)
    setCallbackRes.call(this, res, 'fail', apiIndex)
  },
  consoleComplete: function (res, apiIndex = -1) {
    console.log('%ccomplete:\n', 'color:black;font-weight:bold', res)
    setCallbackRes.call(this, res, 'complete', apiIndex)
  },
  consoleResult: function (res, apiIndex = -1) {
    console.log('%cresult:\n', 'color:blue;font-weight:bold', res)
    setCallbackRes.call(this, res, 'result', apiIndex)
  },
  consoleOnCallback: function (res, apiName, apiIndex = -1) {
    console.log(`%c${apiName} callback:\n`, 'color:green;font-weight:bold', res)
    setCallbackRes.call(this, res, 'callback', apiIndex)
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
