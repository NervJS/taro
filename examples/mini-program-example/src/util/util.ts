function setCallbackRes(res, type, apiIndex) {
  if (apiIndex != -1) {
    const apiList = this.state.list
    if (apiList[apiIndex].callbackRes == null) {
      apiList[apiIndex].callbackRes = {}
    }
    if (type === 'success' || type === 'fail') {
      if (apiList[apiIndex].callbackRes['success']) {
        delete apiList[apiIndex].callbackRes['success']
      }
      if (apiList[apiIndex].callbackRes['fail']) {
        delete apiList[apiIndex].callbackRes['fail']
      }
    }
    apiList[apiIndex].callbackRes[type] = res
    this.setState({
      list: apiList,
    })
  }
}

let startTime = NaN

function getCostTime() {
  return startTime ? Date.now() - startTime : -1
}

export const TestConsole = {
  consoleTest: (apiName: string) => {
    startTime = Date.now()
    console.log(
      `\n%c------------------------------start test [${apiName}]------------------------------`,
      'color:blue;font-weight:bold'
    )
  },
  consoleSuccess: function (res, apiIndex = -1) {
    const costTime = getCostTime()
    setCallbackRes.call(this, res, 'success', apiIndex)
    setCallbackRes.call(this, costTime, 'costTime', apiIndex)
    console.log('%csuccess:\n', 'color:green;font-weight:bold', { success: res, costTime })
  },
  consoleFail: function (res, apiIndex = -1) {
    const costTime = getCostTime()
    setCallbackRes.call(this, res, 'fail', apiIndex)
    setCallbackRes.call(this, costTime, 'costTime', apiIndex)
    console.log('%cfail:\n', 'color:red;font-weight:bold', { fail: res, costTime })
  },
  consoleComplete: function (res, apiIndex = -1) {
    const costTime = getCostTime()
    setCallbackRes.call(this, res, 'complete', apiIndex)
    setCallbackRes.call(this, costTime, 'costTime', apiIndex)
    console.log('%ccomplete:\n', 'color:black;font-weight:bold', { complete: res, costTime })
  },
  consoleResult: function (res, apiIndex = -1) {
    const costTime = getCostTime()
    startTime = NaN
    setCallbackRes.call(this, res, 'result', apiIndex)
    setCallbackRes.call(this, costTime, 'costTime', apiIndex)
    console.log('%cresult:\n', 'color:blue;font-weight:bold', { result: res, costTime })
  },
  consoleOnCallback: function (res, apiName, apiIndex = -1) {
    const costTime = getCostTime()
    setCallbackRes.call(this, res, 'callback', apiIndex)
    setCallbackRes.call(this, costTime, 'costTime', apiIndex)
    console.log(`%c${apiName} callback:\n`, 'color:green;font-weight:bold', { callback: res, costTime })
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
