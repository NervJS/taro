import React from 'react'
import { View, Button, Text } from '@tarojs/components'
// import { TestConsole } from '@/util/util'
import './index.scss'
import Taro from "@tarojs/taro";

function methodTime(fun: (endFun: ()=>void)=>void): Promise<number> {
  return new Promise((resolve)=>{
    let startTimeTaro: number = Date.now()
    fun(()=>{
      const excuteTime = Date.now() - startTimeTaro
      resolve(excuteTime)
    })
  })
}

function taroAndNativeMethodTime(methodName: string, taroFun: (endFun: ()=>void)=>void, nativeFun: (endFun:()=>void)=>void): Promise<{taroTime: number, nativeTime: number, excuteLog: string}>{
  const taroPromise = methodTime(taroFun)
  const nativePromise = methodTime(nativeFun)
  return Promise.all([taroPromise, nativePromise]).then((result)=>{
    const taroTime = result[0]
    const nativeTime = result[1]
    const excuteLog = `同步调用${methodName}() 耗时：Taro ${result[0]} ms, Native ${result[1]}ms`
    return {taroTime, nativeTime, excuteLog}
  })
}

function jsFetch(endFun: ()=>void){
    // 定义请求头
    const headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded,application/json"); // 替换为实际的访问令牌
    headers.append("scene", '1001');
    headers.append("appCode", '0');
    headers.append("thirdKey", "UPYIu5EGmjPu2pQqHOYUaMLk0j4m5tgt9aK1tboYlYeixxkotYfsTvbyRSPNNNjH");
    headers.append("cateCode", "");
    headers.append("version", "2.2");
    headers.append("wxsysinfo", "eyJicmFuZCI6IkhVQVdFSSIsIm1vZGVsIjoiTk9ILUFOMDAiLCJwaXhlbFJhdGlvIjozLjUsInNjcmVlbldpZHRoIjozODQsInNjcmVlbkhlaWdodCI6NzkyLCJ3aW5kb3dXaWR0aCI6Mzg0LCJ3aW5kb3dIZWlnaHQiOjc5Miwic3RhdHVzQmFySGVpZ2h0IjozOSwibGFuZ3VhZ2UiOiJ6aC1IYW5zIiwidmVyc2lvbiI6IjQuMC4xMC4xMCIsInN5c3RlbSI6Ik9wZW5IYXJtb255LTQuMC4xMC4xMCIsInBsYXRmb3JtIjoiT3Blbkhhcm1vbnkiLCJmb250U2l6ZVNldHRpbmciOjE2LCJTREtWZXJzaW9uIjoiMTAiLCJiZW5jaG1hcmtMZXZlbCI6LTEsImFsYnVtQXV0aG9yaXplZCI6ZmFsc2UsImNhbWVyYUF1dGhvcmaserwefsdgesryhcvbiOmZhbHNlLCJtaWNyb3Bob25lQXV0aG9yaXplZCI6ZmFsc2UsIm5vdGlmaWNhdGlvbkF1dGhvcml6ZWQiOnRydWUsInBob25lQ2FsZW5kYXJBdXRob3JpemVkIjpmYWxzZSwiYmx1ZXRvb3RoRW5hYmxlZCI6dHJ1ZSwibG9jYXRpb25FbmFibGVkIjpmYWxzZSwid2lmaUVuYWJsZerteyrbdfdserytrhbdfgdLCJoZWlnaHQiOjc1MywibGVmdCI6MCwicmlnaHQiOjM4NCwidG9wIjozOSwid2lkdGgiOjM4NH0sImxvY2F0aW9uUmVkdWNlZEFjY3VyYWN5Ijp0cnVlLCJ0aGVtZSI6ImxpZ2h0IiwiaG9zdCI6eyJhcHBJZCI6ImNvbS53dWJhLmxpZmVfQkxQYzZzTlIyNFhpSGFmZExXako4UnErbS9rckNxVXdwV3Bqam1jRGZTRkZKMkNDQlNZTHFOUlBiZmdCeXFlYkl2emw0Q0tKZ2ZQbnBjaTN3VE9leElZPSJ9LCJlbmFibGVEZWJ1ZyI6dHJ1ZSwiZGV2aWNlT3JpZW50YXRpb24iOiJxx3J0cmFpdCJ9");
    headers.append("listName", "bj");
    headers.append("content-type", "application/json");
    headers.append("idxx", "B41CF5FA70F3DD19B1D87389CF045C8A1614CBEE645A9174BDDFDF1265A56129");
    headers.append("Cookie", "PPU=\"\";idxx=sdfergdshrthfbscaswqr;sessionid=sdddgerhfgjntfyjvzserweagergsderty;");
    headers.append("accuracy", "");
    headers.append("geo", "");
    headers.append("abtest", "");

    // 发起GET请求
    fetch('http://10.253.108.182:9999/api/pressure/feed?app=sdfwef&lon=&lat=&session=sdfwefwefsgrhrjgjtyjkyukyuksdfxsddr&timestamp=170442018xx28&mediauid=dfghrhgfjyukhmgertdfbvdfhrtyrtdfg&devidmd5=IMEI&utm_source=xxun&spm=u-2h6kyt1yf988m1ww31.wx_mjh_feed_zhaogongzuo&brand=HUAWEI&os=OpenHarmony&model=NOH-AN00&city=bj&cate=pugongjg&slot=lm_list_template&pn=1&ps=10&url=https%3A%2F%2Fwxzzmp.xx.com%2Flist.shtml%3F-15%3D20&sign=3ccfb781037ed655120d63c4b5e5c391&debug=1', {
        method: 'GET',
        headers: headers,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok, status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        endFun()
        // 在这里处理返回的JSON数据
        // console.log(data);
    })
    .catch(error => {
        console.error('Error during fetch operation:', error);
    });
}

export default class Index extends React.Component {
  state = {
    syncSingleResult: '',
    requestSingleResult: '',
    requestConcurrentResult: '',
    requestHignConcurrentResult: '',
    syncResult: '',
    requestByJsResult: ''
  }
  syncSingleTest = ()=>{
    Promise.all([
        methodTime((endFun)=>{
          Taro.getWindowInfo()
          endFun()
        }),
        methodTime((endFun)=>{
          // @ts-ignore
          native.getWindowInfo()
          endFun()
        }),
        methodTime((endFun)=>{
          Taro.getScreenBrightness({
            success: function () {endFun()},
            fail: function (){endFun()},
            complete: function () {}
          })
        }),
        methodTime((endFun)=>{
          // @ts-ignore
          native.getScreenBrightness({
            success: function () {endFun()},
            fail: function (){endFun()},
          })
        })
      ])
      .then((result)=>{
        let totalExcuteLog: string[] = []
        totalExcuteLog.push(`同步调用getWindowInfo() 耗时：Taro ${result[0]} ms, Native ${result[1]}ms`)
        totalExcuteLog.push(`异步调用getScreenBrightness() 耗时：Taro ${result[2]} ms, Native ${result[3]}ms`)
        this.setState({
          syncSingleResult: totalExcuteLog.join('\n')
        })
      })
  }

  syncPressureTest = ()=>{
    Promise.all([
      // @ts-ignore
      taroAndNativeMethodTime('getSystemInfoSync', (endFun)=>{Taro.getSystemInfoSync();endFun()}, (endFun)=>{native.getSystemInfoSync();endFun()}),
      // @ts-ignore
      taroAndNativeMethodTime('getWindowInfo', (endFun)=>{Taro.getWindowInfo();endFun()}, (endFun)=>{native.getWindowInfo();endFun()}),
      // @ts-ignore
      taroAndNativeMethodTime('getSystemSetting', (endFun)=>{Taro.getSystemSetting();endFun()}, (endFun)=>{native.getSystemSetting();endFun()}),
      // @ts-ignore
      taroAndNativeMethodTime('getAppBaseInfo', (endFun)=>{Taro.getAppBaseInfo();endFun()}, (endFun)=>{native.getAppBaseInfo();endFun()}),
      // @ts-ignore
      taroAndNativeMethodTime('getSystemInfoSync', (endFun)=>{Taro.getSystemInfoSync();endFun()}, (endFun)=>{native.getSystemInfoSync();endFun()}),
      // @ts-ignore
      taroAndNativeMethodTime('getAppAuthorizeSetting', (endFun)=>{Taro.getAppAuthorizeSetting();endFun()}, (endFun)=>{native.getAppAuthorizeSetting();endFun()}),
      // @ts-ignore
      taroAndNativeMethodTime('getSystemInfoSync', (endFun)=>{Taro.getSystemInfoSync();endFun()}, (endFun)=>{native.getSystemInfoSync();endFun()}),
      // @ts-ignore
      taroAndNativeMethodTime('getWindowInfo', (endFun)=>{Taro.getWindowInfo();endFun()}, (endFun)=>{native.getWindowInfo();endFun()}),
      // @ts-ignore
      taroAndNativeMethodTime('getAppBaseInfo', (endFun)=>{Taro.getAppBaseInfo();endFun()}, (endFun)=>{native.getAppBaseInfo();endFun()}),
      // @ts-ignore
      taroAndNativeMethodTime('getSystemInfoSync', (endFun)=>{Taro.getSystemInfoSync();endFun()}, (endFun)=>{native.getSystemInfoSync();endFun()}),
      // @ts-ignore
      taroAndNativeMethodTime('getAppAuthorizeSetting', (endFun)=>{Taro.getAppAuthorizeSetting();endFun()}, (endFun)=>{native.getAppAuthorizeSetting();endFun()}),
      // @ts-ignore
      taroAndNativeMethodTime('getSystemInfoSync', (endFun)=>{Taro.getSystemInfoSync();endFun()}, (endFun)=>{native.getSystemInfoSync();endFun()}),
      // @ts-ignore
      taroAndNativeMethodTime('getWindowInfo', (endFun)=>{Taro.getWindowInfo();endFun()}, (endFun)=>{native.getWindowInfo();endFun()}),
      // @ts-ignore
      taroAndNativeMethodTime('getSystemSetting', (endFun)=>{Taro.getSystemSetting();endFun()}, (endFun)=>{native.getSystemSetting();endFun()}),
      // @ts-ignore
      taroAndNativeMethodTime('getAppBaseInfo', (endFun)=>{Taro.getAppBaseInfo();endFun()}, (endFun)=>{native.getAppBaseInfo();endFun()}),
      // @ts-ignore
      taroAndNativeMethodTime('getSystemInfoSync', (endFun)=>{Taro.getSystemInfoSync();endFun()}, (endFun)=>{native.getSystemInfoSync();endFun()}),
      // @ts-ignore
      taroAndNativeMethodTime('getAppAuthorizeSetting', (endFun)=>{Taro.getAppAuthorizeSetting();endFun()}, (endFun)=>{native.getAppAuthorizeSetting();endFun()}),
      // @ts-ignore
      taroAndNativeMethodTime('getMenuButtonBoundingClientRect', (endFun)=>{Taro.getMenuButtonBoundingClientRect();endFun()}, (endFun)=>{native.getMenuButtonBoundingClientRect();endFun()}),
      // @ts-ignore
      taroAndNativeMethodTime('getSystemInfoSync', (endFun)=>{Taro.getSystemInfoSync();endFun()}, (endFun)=>{native.getSystemInfoSync();endFun()}),
      // @ts-ignore
      taroAndNativeMethodTime('getWindowInfo', (endFun)=>{Taro.getWindowInfo();endFun()}, (endFun)=>{native.getWindowInfo();endFun()}),
      // @ts-ignore
      taroAndNativeMethodTime('getAppBaseInfo', (endFun)=>{Taro.getAppBaseInfo();endFun()}, (endFun)=>{native.getAppBaseInfo();endFun()}),
      // @ts-ignore
      taroAndNativeMethodTime('getSystemInfoSync', (endFun)=>{Taro.getSystemInfoSync();endFun()}, (endFun)=>{native.getSystemInfoSync();endFun()}),
      // @ts-ignore
      taroAndNativeMethodTime('getAppAuthorizeSetting', (endFun)=>{Taro.getAppAuthorizeSetting();endFun()}, (endFun)=>{native.getAppAuthorizeSetting();endFun()}),
      // @ts-ignore
      taroAndNativeMethodTime('getSystemInfoSync', (endFun)=>{Taro.getSystemInfoSync();endFun()}, (endFun)=>{native.getSystemInfoSync();endFun()}),
      // @ts-ignore
      taroAndNativeMethodTime('getWindowInfo', (endFun)=>{Taro.getWindowInfo();endFun()}, (endFun)=>{native.getWindowInfo();endFun()}),
      // @ts-ignore
      taroAndNativeMethodTime('getAppBaseInfo', (endFun)=>{Taro.getAppBaseInfo();endFun()}, (endFun)=>{native.getAppBaseInfo();endFun()}),
      // @ts-ignore
      taroAndNativeMethodTime('getSystemInfoSync', (endFun)=>{Taro.getSystemInfoSync();endFun()}, (endFun)=>{native.getSystemInfoSync();endFun()}),
      // @ts-ignore
      taroAndNativeMethodTime('getAppAuthorizeSetting', (endFun)=>{Taro.getAppAuthorizeSetting();endFun()}, (endFun)=>{native.getAppAuthorizeSetting();endFun()}),
    ])
    .then((result)=>{
      let totalElapsedTimeTaro = 0
      let totalElapsedTimeNative = 0
      const totalExcuteLog: string[] = []
      totalExcuteLog.push('同步方法压测：case构建：冷启动场景，28次同步调用')
      result.forEach(({taroTime, nativeTime, excuteLog})=>{
        totalElapsedTimeTaro += taroTime
        totalElapsedTimeNative += nativeTime
        totalExcuteLog.push(excuteLog)
      })
      totalExcuteLog.push(`总计调用 ${result.length}个方法 \n Taro执行总时间 ${totalElapsedTimeTaro} ms，Native执行总时间 ${totalElapsedTimeNative} ms`)
      this.setState({
        syncResult: totalExcuteLog.join('\n')
      })
    })
  }
  requestSingleTest = ()=>{
        Promise.all([
            methodTime((endFun)=>{
                // 日志请求
                Taro.request({
                    url: 'http://10.253.108.182:9999/api/pressure/tracklog?wxid=wlfkjwoejfjsdfjowie&uid=slkfjowejfkmofwe&loginUid=undefined&trackURL=%7B%22pagePath%22%3A%22%2Fpages%2Findex%2Findex%22%2C%22refPagePath%22%3A%22%2Fpages%2Fprivacy%2Findex%22%2C%22pageParam%22%3A%22stamp%253DAE%2526%252524taroTimestamp%253D1704420185161%22%2C%22pageType%22%3A%22index%22%2C%22pageName%22%3A%22index%22%2C%22pageInfo%22%3A%22%22%2C%22loadTime%22%3A0%2C%22cateCode%22%3A%22%22%2C%22cate%22%3A%22%22%2C%22xxx_id%22%3A%22%22%2C%22bendiicontype%22%3A%22%22%2C%22currInfoId%22%3A%22%22%2C%22currentCateCode%22%3A%22%22%2C%22scene%22%3A1001%2C%22thirdKey%22%3A%22UPYIu5EGmjPu2pQqHOYUaMLk0j4m5tgt9aK1tboYlYeixxkotYfsTvbyRSPNNNjH%22%2C%22area%22%3A%221%22%2C%22openId%22%3A%22B41CF5FA70F3DD19B1D87389CF045C8A1614CBEE645A9174BDDFDF1265A56129%22%2C%22unionId%22%3A%22C8684F4C3107AD7AA8B19B343D75DDF989D120311D18F9F41EB2320F6FFA66BE%22%2C%22pagetype%22%3A%22index%22%2C%22page%22%3A%22%22%2C%22qudao%22%3A%22weixin%22%2C%22url%22%3A%22%2Fpages%2Findex%2Findex%22%2C%22referrer%22%3A%22%2Fpages%2Fprivacy%2Findex%22%2C%22version%22%3A%222.12.12%22%2C%22spm%22%3A%22%22%2C%22utm_source%22%3A%22%22%2C%22launch_source%22%3A%22%22%2C%22from_userid%22%3A%22%22%2C%22hasuserid%22%3A0%7D&v=1.0.0&rand_id=0.9838634192853211&thirdKey=UPYIu5EGmjPu2pQqHOYUaMLk0j4m5tgt9aK1tboYlYeixxkotYfsTvbyRSPNNNjH&appCode=0&debug=1',
                    method: 'GET',
                    data: {},
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded,application/json",
                        "scene": 1001,
                        "appCode": "0",
                        "thirdKey": "sklfmowejfklsmfoijwfjlksdmgvioejrgkdmv;ojdspjrlmsdsvklnsoidjfpwk",
                        "cateCode": "",
                        "version": "2.12.12",
                        "wxsysinfo": "eyJicmFuZCI6IkhVQVdFSSIsIm1vZGVsIjoiTk9ILUFOMDAiLCJwaXhlbFJhdGlvIjozLjUsInNjcmVlbldpZHRoIjozODQsInNjcmVlbkhlaWdodCI6NzkyLCJ3aW5kb3dXaWR0aCI6Mzg0LCJ3aW5kb3dIZWlnaHQiOjc5Miwic3RhdHVzQmFySGVpZ2h0IjozOSwibGFuZ3VhZ2UiOiJ6aC1IYW5zIiwidmVyc2lvbiI6I23123113161RlbSI6Ik9wZW5IYXJtb255LTQuMC4xMC4xMCIsInBsYXRmb3JtIjoiT3Blbkhhcm1vbnkiLCJmb250U2l6ZVNldHRpbmciOjE2LCJTREtWZXJzaW9uIjoiMTAiLCJiZW5jaG1hcmtMZXZlbCI6LTEsImFsYnVtQXV0aG9yaXplZCI6ZmFsc2UsImNhbWVyYUF1dGhvcml6ZWQiOmZhbHNlLCJsb2NhdGlvbkF1dGhvcml6ZWQisdfwefsdgv3Bob25lQXV0aG9yaXplZCI6ZmFsgwegfwegwegsdgfkF1dGhvcml6ZWQiOnRydWUsInBob25lQ2FsZW5kYXJBdXRob3JpemVkIjpmYWxzZSwiYmx1ZXRvb3RoRW5hYmxlZCI6dHJ1ZSwqwrqwdasdafsdfgdfghergewvcxbcvxcvhdfydid2lmaUVuYWJsZWQiOnRydWUsInNhZmVBcmVhIjp7ImJvdHRvbSI6NzkyLCJoZWlnaHQiOjc1MywibGVmdCI6MCwicmlnaHQiOjM4NCwidG9wIjozOSwid2lkdGgiOjM4NH0sImxvY2F0aW9uUmVkdWNlZEFjY3VyYWN5Ijp0cnVlLCJ0aGVtZSI6ImxpZ2h0IiwisefkwoejfowfwecHBJZCI6ImNvbS53dWJhLmxpZmVfQkxQYzZzTlIyNFhpSGFmZExXako4UnErbS9rckNxVXdwV3Bqam1jRGZTRkZKMkNDQlNZTHFOUlBiZmdCeXFlYkl2emw0Q0tKZ2ZQbnBjaTN3VE9leElZPSJ9LCJlbmFibGVEZWJ1ZyI6dHJ1ZSwiZGV2aWNlT3JpZW50YXRpb24iOiJxx3J0cmFpdCJ9",
                        "listName": "bj"
                    },
                    fail(res){
                        console.log('request fail **** ', res)
                        endFun()
                    },
                    success(res) {
                        console.log('request result ***** ', res.data)
                        endFun()
                    },
                })
            }),
            methodTime((endFun)=>{
                // @ts-ignore 日志请求
                native.request({
                    url: 'http://10.253.108.182:9999/api/pressure/tracklog?wxid=wlfkjwoejfjsdfjowie&uid=slkfjowejfkmofwe&loginUid=undefined&trackURL=%7B%22pagePath%22%3A%22%2Fpages%2Findex%2Findex%22%2C%22refPagePath%22%3A%22%2Fpages%2Fprivacy%2Findex%22%2C%22pageParam%22%3A%22stamp%253DAE%2526%252524taroTimestamp%253D1704420185161%22%2C%22pageType%22%3A%22index%22%2C%22pageName%22%3A%22index%22%2C%22pageInfo%22%3A%22%22%2C%22loadTime%22%3A0%2C%22cateCode%22%3A%22%22%2C%22cate%22%3A%22%22%2C%22xxx_id%22%3A%22%22%2C%22bendiicontype%22%3A%22%22%2C%22currInfoId%22%3A%22%22%2C%22currentCateCode%22%3A%22%22%2C%22scene%22%3A1001%2C%22thirdKey%22%3A%22UPYIu5EGmjPu2pQqHOYUaMLk0j4m5tgt9aK1tboYlYeixxkotYfsTvbyRSPNNNjH%22%2C%22area%22%3A%221%22%2C%22openId%22%3A%22B41CF5FA70F3DD19B1D87389CF045C8A1614CBEE645A9174BDDFDF1265A56129%22%2C%22unionId%22%3A%22C8684F4C3107AD7AA8B19B343D75DDF989D120311D18F9F41EB2320F6FFA66BE%22%2C%22pagetype%22%3A%22index%22%2C%22page%22%3A%22%22%2C%22qudao%22%3A%22weixin%22%2C%22url%22%3A%22%2Fpages%2Findex%2Findex%22%2C%22referrer%22%3A%22%2Fpages%2Fprivacy%2Findex%22%2C%22version%22%3A%222.12.12%22%2C%22spm%22%3A%22%22%2C%22utm_source%22%3A%22%22%2C%22launch_source%22%3A%22%22%2C%22from_userid%22%3A%22%22%2C%22hasuserid%22%3A0%7D&v=1.0.0&rand_id=0.9838634192853211&thirdKey=UPYIu5EGmjPu2pQqHOYUaMLk0j4m5tgt9aK1tboYlYeixxkotYfsTvbyRSPNNNjH&appCode=0&debug=1',
                    method: 'GET',
                    data: {},
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded,application/json",
                        "scene": 1001,
                        "appCode": "0",
                        "thirdKey": "sklfmowejfklsmfoijwfjlksdmgvioejrgkdmv;ojdspjrlmsdsvklnsoidjfpwk",
                        "cateCode": "",
                        "version": "2.12.12",
                        "wxsysinfo": "eyJicmFuZCI6IkhVQVdFSSIsIm1vZGVsIjoiTk9ILUFOMDAiLCJwaXhlbFJhdGlvIjozLjUsInNjcmVlbldpZHRoIjozODQsInNjcmVlbkhlaWdodCI6NzkyLCJ3aW5kb3dXaWR0aCI6Mzg0LCJ3aW5kb3dIZWlnaHQiOjc5Miwic3RhdHVzQmFySGVpZ2h0IjozOSwibGFuZ3VhZ2UiOiJ6aC1IYW5zIiwidmVyc2lvbiI6I23123113161RlbSI6Ik9wZW5IYXJtb255LTQuMC4xMC4xMCIsInBsYXRmb3JtIjoiT3Blbkhhcm1vbnkiLCJmb250U2l6ZVNldHRpbmciOjE2LCJTREtWZXJzaW9uIjoiMTAiLCJiZW5jaG1hcmtMZXZlbCI6LTEsImFsYnVtQXV0aG9yaXplZCI6ZmFsc2UsImNhbWVyYUF1dGhvcml6ZWQiOmZhbHNlLCJsb2NhdGlvbkF1dGhvcml6ZWQisdfwefsdgv3Bob25lQXV0aG9yaXplZCI6ZmFsgwegfwegwegsdgfkF1dGhvcml6ZWQiOnRydWUsInBob25lQ2FsZW5kYXJBdXRob3JpemVkIjpmYWxzZSwiYmx1ZXRvb3RoRW5hYmxlZCI6dHJ1ZSwqwrqwdasdafsdfgdfghergewvcxbcvxcvhdfydid2lmaUVuYWJsZWQiOnRydWUsInNhZmVBcmVhIjp7ImJvdHRvbSI6NzkyLCJoZWlnaHQiOjc1MywibGVmdCI6MCwicmlnaHQiOjM4NCwidG9wIjozOSwid2lkdGgiOjM4NH0sImxvY2F0aW9uUmVkdWNlZEFjY3VyYWN5Ijp0cnVlLCJ0aGVtZSI6ImxpZ2h0IiwisefkwoejfowfwecHBJZCI6ImNvbS53dWJhLmxpZmVfQkxQYzZzTlIyNFhpSGFmZExXako4UnErbS9rckNxVXdwV3Bqam1jRGZTRkZKMkNDQlNZTHFOUlBiZmdCeXFlYkl2emw0Q0tKZ2ZQbnBjaTN3VE9leElZPSJ9LCJlbmFibGVEZWJ1ZyI6dHJ1ZSwiZGV2aWNlT3JpZW50YXRpb24iOiJxx3J0cmFpdCJ9",
                        "listName": "bj"
                    },
                    fail(res){
                        console.log('request fail **** ', res)
                        endFun()
                    },
                    success(res) {
                        console.log('request result ***** ', res.data)
                        endFun()
                    },
                })
            }),
            methodTime((endFun)=>{
                // 日志请求
                Taro.request({
                    url: 'http://10.253.108.182:9999/api/pressure/feed?app=sdfwef&lon=&lat=&session=sdfwefwefsgrhrjgjtyjkyukyuksdfxsddr&timestamp=170442018xx28&mediauid=dfghrhgfjyukhmgertdfbvdfhrtyrtdfg&devidmd5=IMEI&utm_source=xxun&spm=u-2h6kyt1yf988m1ww31.wx_mjh_feed_zhaogongzuo&brand=HUAWEI&os=OpenHarmony&model=NOH-AN00&city=bj&cate=pugongjg&slot=lm_list_template&pn=1&ps=10&url=https%3A%2F%2Fwxzzmp.xx.com%2Flist.shtml%3F-15%3D20&sign=3ccfb781037ed655120d63c4b5e5c391&debug=1',
                    method: 'GET',
                    data: {},
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded,application/json",
                        "scene": 1001,
                        "appCode": "0",
                        "thirdKey": "UPYIu5EGmjPu2pQqHOYUaMLk0j4m5tgt9aK1tboYlYeixxkotYfsTvbyRSPNNNjH",
                        "cateCode": "",
                        "version": 2.2,
                        "wxsysinfo": "eyJicmFuZCI6IkhVQVdFSSIsIm1vZGVsIjoiTk9ILUFOMDAiLCJwaXhlbFJhdGlvIjozLjUsInNjcmVlbldpZHRoIjozODQsInNjcmVlbkhlaWdodCI6NzkyLCJ3aW5kb3dXaWR0aCI6Mzg0LCJ3aW5kb3dIZWlnaHQiOjc5Miwic3RhdHVzQmFySGVpZ2h0IjozOSwibGFuZ3VhZ2UiOiJ6aC1IYW5zIiwidmVyc2lvbiI6IjQuMC4xMC4xMCIsInN5c3RlbSI6Ik9wZW5IYXJtb255LTQuMC4xMC4xMCIsInBsYXRmb3JtIjoiT3Blbkhhcm1vbnkiLCJmb250U2l6ZVNldHRpbmciOjE2LCJTREtWZXJzaW9uIjoiMTAiLCJiZW5jaG1hcmtMZXZlbCI6LTEsImFsYnVtQXV0aG9yaXplZCI6ZmFsc2UsImNhbWVyYUF1dGhvcmaserwefsdgesryhcvbiOmZhbHNlLCJtaWNyb3Bob25lQXV0aG9yaXplZCI6ZmFsc2UsIm5vdGlmaWNhdGlvbkF1dGhvcml6ZWQiOnRydWUsInBob25lQ2FsZW5kYXJBdXRob3JpemVkIjpmYWxzZSwiYmx1ZXRvb3RoRW5hYmxlZCI6dHJ1ZSwibG9jYXRpb25FbmFibGVkIjpmYWxzZSwid2lmaUVuYWJsZerteyrbdfdserytrhbdfgdLCJoZWlnaHQiOjc1MywibGVmdCI6MCwicmlnaHQiOjM4NCwidG9wIjozOSwid2lkdGgiOjM4NH0sImxvY2F0aW9uUmVkdWNlZEFjY3VyYWN5Ijp0cnVlLCJ0aGVtZSI6ImxpZ2h0IiwiaG9zdCI6eyJhcHBJZCI6ImNvbS53dWJhLmxpZmVfQkxQYzZzTlIyNFhpSGFmZExXako4UnErbS9rckNxVXdwV3Bqam1jRGZTRkZKMkNDQlNZTHFOUlBiZmdCeXFlYkl2emw0Q0tKZ2ZQbnBjaTN3VE9leElZPSJ9LCJlbmFibGVEZWJ1ZyI6dHJ1ZSwiZGV2aWNlT3JpZW50YXRpb24iOiJxx3J0cmFpdCJ9",
                        "listName": "bj",
                        "content-type": "application/json",
                        "idxx": "B41CF5FA70F3DD19B1D87389CF045C8A1614CBEE645A9174BDDFDF1265A56129",
                        "Cookie": "PPU=\"\";idxx=sdfergdshrthfbscaswqr;sessionid=sdddgerhfgjntfyjvzserweagergsderty;",
                        "accuracy": "",
                        "geo": "",
                        "abtest": ""
                    },
                    fail(res){
                        console.log('request fail **** ', res)
                        endFun()
                    },
                    success(res) {
                        console.log('request result ***** ', JSON.stringify(res.data))
                        endFun()
                    },
                })
            }),
            methodTime((endFun)=>{
                // @ts-ignore 日志请求
                native.request({
                    url: 'http://10.253.108.182:9999/api/pressure/feed?app=sdfwef&lon=&lat=&session=sdfwefwefsgrhrjgjtyjkyukyuksdfxsddr&timestamp=170442018xx28&mediauid=dfghrhgfjyukhmgertdfbvdfhrtyrtdfg&devidmd5=IMEI&utm_source=xxun&spm=u-2h6kyt1yf988m1ww31.wx_mjh_feed_zhaogongzuo&brand=HUAWEI&os=OpenHarmony&model=NOH-AN00&city=bj&cate=pugongjg&slot=lm_list_template&pn=1&ps=10&url=https%3A%2F%2Fwxzzmp.xx.com%2Flist.shtml%3F-15%3D20&sign=3ccfb781037ed655120d63c4b5e5c391&debug=1',
                    method: 'GET',
                    data: {},
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded,application/json",
                        "scene": 1001,
                        "appCode": "0",
                        "thirdKey": "UPYIu5EGmjPu2pQqHOYUaMLk0j4m5tgt9aK1tboYlYeixxkotYfsTvbyRSPNNNjH",
                        "cateCode": "",
                        "version": 2.2,
                        "wxsysinfo": "eyJicmFuZCI6IkhVQVdFSSIsIm1vZGVsIjoiTk9ILUFOMDAiLCJwaXhlbFJhdGlvIjozLjUsInNjcmVlbldpZHRoIjozODQsInNjcmVlbkhlaWdodCI6NzkyLCJ3aW5kb3dXaWR0aCI6Mzg0LCJ3aW5kb3dIZWlnaHQiOjc5Miwic3RhdHVzQmFySGVpZ2h0IjozOSwibGFuZ3VhZ2UiOiJ6aC1IYW5zIiwidmVyc2lvbiI6IjQuMC4xMC4xMCIsInN5c3RlbSI6Ik9wZW5IYXJtb255LTQuMC4xMC4xMCIsInBsYXRmb3JtIjoiT3Blbkhhcm1vbnkiLCJmb250U2l6ZVNldHRpbmciOjE2LCJTREtWZXJzaW9uIjoiMTAiLCJiZW5jaG1hcmtMZXZlbCI6LTEsImFsYnVtQXV0aG9yaXplZCI6ZmFsc2UsImNhbWVyYUF1dGhvcmaserwefsdgesryhcvbiOmZhbHNlLCJtaWNyb3Bob25lQXV0aG9yaXplZCI6ZmFsc2UsIm5vdGlmaWNhdGlvbkF1dGhvcml6ZWQiOnRydWUsInBob25lQ2FsZW5kYXJBdXRob3JpemVkIjpmYWxzZSwiYmx1ZXRvb3RoRW5hYmxlZCI6dHJ1ZSwibG9jYXRpb25FbmFibGVkIjpmYWxzZSwid2lmaUVuYWJsZerteyrbdfdserytrhbdfgdLCJoZWlnaHQiOjc1MywibGVmdCI6MCwicmlnaHQiOjM4NCwidG9wIjozOSwid2lkdGgiOjM4NH0sImxvY2F0aW9uUmVkdWNlZEFjY3VyYWN5Ijp0cnVlLCJ0aGVtZSI6ImxpZ2h0IiwiaG9zdCI6eyJhcHBJZCI6ImNvbS53dWJhLmxpZmVfQkxQYzZzTlIyNFhpSGFmZExXako4UnErbS9rckNxVXdwV3Bqam1jRGZTRkZKMkNDQlNZTHFOUlBiZmdCeXFlYkl2emw0Q0tKZ2ZQbnBjaTN3VE9leElZPSJ9LCJlbmFibGVEZWJ1ZyI6dHJ1ZSwiZGV2aWNlT3JpZW50YXRpb24iOiJxx3J0cmFpdCJ9",
                        "listName": "bj",
                        "content-type": "application/json",
                        "idxx": "B41CF5FA70F3DD19B1D87389CF045C8A1614CBEE645A9174BDDFDF1265A56129",
                        "Cookie": "PPU=\"\";idxx=sdfergdshrthfbscaswqr;sessionid=sdddgerhfgjntfyjvzserweagergsderty;",
                        "accuracy": "",
                        "geo": "",
                        "abtest": ""
                    },
                    fail(res){
                        console.log('request fail **** ', res)
                        endFun()
                    },
                    success(res) {
                        console.log('request result ***** ', JSON.stringify(res.data))
                        endFun()
                    },
                })
            })
        ])
        .then((result)=>{
            const logs: string[] = []
            logs.push(`tracklog请求耗时：Taro ${result[0]} ms, Native ${result[1]} ms`)
            logs.push(`Feed请求耗时：Taro ${result[2]} ms, Native ${result[3]} ms`)
            this.setState({
                requestSingleResult: logs.join('\n')
            })
        })
    }
  requestConcurentTest = ()=>{
    const startTime = Date.now()
    const promiseArray:Promise<number>[] = []
    for (let i=1; i <= 5; i++) {
      promiseArray.push(methodTime((endFun)=>{
          // 日志请求
          Taro.request({
              url: 'http://10.253.108.182:9999/api/pressure/tracklog?wxid=wlfkjwoejfjsdfjowie&uid=slkfjowejfkmofwe&loginUid=undefined&trackURL=%7B%22pagePath%22%3A%22%2Fpages%2Findex%2Findex%22%2C%22refPagePath%22%3A%22%2Fpages%2Fprivacy%2Findex%22%2C%22pageParam%22%3A%22stamp%253DAE%2526%252524taroTimestamp%253D1704420185161%22%2C%22pageType%22%3A%22index%22%2C%22pageName%22%3A%22index%22%2C%22pageInfo%22%3A%22%22%2C%22loadTime%22%3A0%2C%22cateCode%22%3A%22%22%2C%22cate%22%3A%22%22%2C%22xxx_id%22%3A%22%22%2C%22bendiicontype%22%3A%22%22%2C%22currInfoId%22%3A%22%22%2C%22currentCateCode%22%3A%22%22%2C%22scene%22%3A1001%2C%22thirdKey%22%3A%22UPYIu5EGmjPu2pQqHOYUaMLk0j4m5tgt9aK1tboYlYeixxkotYfsTvbyRSPNNNjH%22%2C%22area%22%3A%221%22%2C%22openId%22%3A%22B41CF5FA70F3DD19B1D87389CF045C8A1614CBEE645A9174BDDFDF1265A56129%22%2C%22unionId%22%3A%22C8684F4C3107AD7AA8B19B343D75DDF989D120311D18F9F41EB2320F6FFA66BE%22%2C%22pagetype%22%3A%22index%22%2C%22page%22%3A%22%22%2C%22qudao%22%3A%22weixin%22%2C%22url%22%3A%22%2Fpages%2Findex%2Findex%22%2C%22referrer%22%3A%22%2Fpages%2Fprivacy%2Findex%22%2C%22version%22%3A%222.12.12%22%2C%22spm%22%3A%22%22%2C%22utm_source%22%3A%22%22%2C%22launch_source%22%3A%22%22%2C%22from_userid%22%3A%22%22%2C%22hasuserid%22%3A0%7D&v=1.0.0&rand_id=0.9838634192853211&thirdKey=UPYIu5EGmjPu2pQqHOYUaMLk0j4m5tgt9aK1tboYlYeixxkotYfsTvbyRSPNNNjH&appCode=0&debug=1',
              method: 'GET',
              data: {},
              header: {
                  "Content-Type": "application/x-www-form-urlencoded,application/json",
                  "scene": 1001,
                  "appCode": "0",
                  "thirdKey": "sklfmowejfklsmfoijwfjlksdmgvioejrgkdmv;ojdspjrlmsdsvklnsoidjfpwk",
                  "cateCode": "",
                  "version": "2.12.12",
                  "wxsysinfo": "eyJicmFuZCI6IkhVQVdFSSIsIm1vZGVsIjoiTk9ILUFOMDAiLCJwaXhlbFJhdGlvIjozLjUsInNjcmVlbldpZHRoIjozODQsInNjcmVlbkhlaWdodCI6NzkyLCJ3aW5kb3dXaWR0aCI6Mzg0LCJ3aW5kb3dIZWlnaHQiOjc5Miwic3RhdHVzQmFySGVpZ2h0IjozOSwibGFuZ3VhZ2UiOiJ6aC1IYW5zIiwidmVyc2lvbiI6I23123113161RlbSI6Ik9wZW5IYXJtb255LTQuMC4xMC4xMCIsInBsYXRmb3JtIjoiT3Blbkhhcm1vbnkiLCJmb250U2l6ZVNldHRpbmciOjE2LCJTREtWZXJzaW9uIjoiMTAiLCJiZW5jaG1hcmtMZXZlbCI6LTEsImFsYnVtQXV0aG9yaXplZCI6ZmFsc2UsImNhbWVyYUF1dGhvcml6ZWQiOmZhbHNlLCJsb2NhdGlvbkF1dGhvcml6ZWQisdfwefsdgv3Bob25lQXV0aG9yaXplZCI6ZmFsgwegfwegwegsdgfkF1dGhvcml6ZWQiOnRydWUsInBob25lQ2FsZW5kYXJBdXRob3JpemVkIjpmYWxzZSwiYmx1ZXRvb3RoRW5hYmxlZCI6dHJ1ZSwqwrqwdasdafsdfgdfghergewvcxbcvxcvhdfydid2lmaUVuYWJsZWQiOnRydWUsInNhZmVBcmVhIjp7ImJvdHRvbSI6NzkyLCJoZWlnaHQiOjc1MywibGVmdCI6MCwicmlnaHQiOjM4NCwidG9wIjozOSwid2lkdGgiOjM4NH0sImxvY2F0aW9uUmVkdWNlZEFjY3VyYWN5Ijp0cnVlLCJ0aGVtZSI6ImxpZ2h0IiwisefkwoejfowfwecHBJZCI6ImNvbS53dWJhLmxpZmVfQkxQYzZzTlIyNFhpSGFmZExXako4UnErbS9rckNxVXdwV3Bqam1jRGZTRkZKMkNDQlNZTHFOUlBiZmdCeXFlYkl2emw0Q0tKZ2ZQbnBjaTN3VE9leElZPSJ9LCJlbmFibGVEZWJ1ZyI6dHJ1ZSwiZGV2aWNlT3JpZW50YXRpb24iOiJxx3J0cmFpdCJ9",
                  "listName": "bj"
              },
              fail(res){
                  console.log('request fail **** ', res)
                  endFun()
              },
              success(res) {
                  console.log('request result ***** ', res.data)
                  endFun()
              },
          })
      }))
    }

    Promise.all(promiseArray)
    .then((result)=>{
        const totalTime = Date.now() - startTime
        const logs: string[] = []

        let serialTime = 0
        result.forEach((value, index)=>{
            logs.push(`请求${index}的耗时： ${value} ms`)
            serialTime += value
        })

        logs.push(`并发请求时间：${totalTime}ms，串行请求时间：${serialTime} ms`)
        logs.push(`是否为并行执行：${totalTime < serialTime}`)
        this.setState({
            requestConcurrentResult: logs.join('\n')
        })
    })
  }
  requestHignConcurentTest = ()=>{
      const startTime = Date.now()
      const promiseArray:Promise<number>[] = []
      for (let i=1; i <= 30; i++) {
          promiseArray.push(methodTime((endFun)=>{
              // 日志请求
              Taro.request({
                  url: 'http://10.253.108.182:9999/api/pressure/feed?app=sdfwef&lon=&lat=&session=sdfwefwefsgrhrjgjtyjkyukyuksdfxsddr&timestamp=170442018xx28&mediauid=dfghrhgfjyukhmgertdfbvdfhrtyrtdfg&devidmd5=IMEI&utm_source=xxun&spm=u-2h6kyt1yf988m1ww31.wx_mjh_feed_zhaogongzuo&brand=HUAWEI&os=OpenHarmony&model=NOH-AN00&city=bj&cate=pugongjg&slot=lm_list_template&pn=1&ps=10&url=https%3A%2F%2Fwxzzmp.xx.com%2Flist.shtml%3F-15%3D20&sign=3ccfb781037ed655120d63c4b5e5c391&debug=1',
                  method: 'GET',
                  data: {},
                  header: {
                      "Content-Type": "application/x-www-form-urlencoded,application/json",
                      "scene": 1001,
                      "appCode": "0",
                      "thirdKey": "UPYIu5EGmjPu2pQqHOYUaMLk0j4m5tgt9aK1tboYlYeixxkotYfsTvbyRSPNNNjH",
                      "cateCode": "",
                      "version": 2.2,
                      "wxsysinfo": "eyJicmFuZCI6IkhVQVdFSSIsIm1vZGVsIjoiTk9ILUFOMDAiLCJwaXhlbFJhdGlvIjozLjUsInNjcmVlbldpZHRoIjozODQsInNjcmVlbkhlaWdodCI6NzkyLCJ3aW5kb3dXaWR0aCI6Mzg0LCJ3aW5kb3dIZWlnaHQiOjc5Miwic3RhdHVzQmFySGVpZ2h0IjozOSwibGFuZ3VhZ2UiOiJ6aC1IYW5zIiwidmVyc2lvbiI6IjQuMC4xMC4xMCIsInN5c3RlbSI6Ik9wZW5IYXJtb255LTQuMC4xMC4xMCIsInBsYXRmb3JtIjoiT3Blbkhhcm1vbnkiLCJmb250U2l6ZVNldHRpbmciOjE2LCJTREtWZXJzaW9uIjoiMTAiLCJiZW5jaG1hcmtMZXZlbCI6LTEsImFsYnVtQXV0aG9yaXplZCI6ZmFsc2UsImNhbWVyYUF1dGhvcmaserwefsdgesryhcvbiOmZhbHNlLCJtaWNyb3Bob25lQXV0aG9yaXplZCI6ZmFsc2UsIm5vdGlmaWNhdGlvbkF1dGhvcml6ZWQiOnRydWUsInBob25lQ2FsZW5kYXJBdXRob3JpemVkIjpmYWxzZSwiYmx1ZXRvb3RoRW5hYmxlZCI6dHJ1ZSwibG9jYXRpb25FbmFibGVkIjpmYWxzZSwid2lmaUVuYWJsZerteyrbdfdserytrhbdfgdLCJoZWlnaHQiOjc1MywibGVmdCI6MCwicmlnaHQiOjM4NCwidG9wIjozOSwid2lkdGgiOjM4NH0sImxvY2F0aW9uUmVkdWNlZEFjY3VyYWN5Ijp0cnVlLCJ0aGVtZSI6ImxpZ2h0IiwiaG9zdCI6eyJhcHBJZCI6ImNvbS53dWJhLmxpZmVfQkxQYzZzTlIyNFhpSGFmZExXako4UnErbS9rckNxVXdwV3Bqam1jRGZTRkZKMkNDQlNZTHFOUlBiZmdCeXFlYkl2emw0Q0tKZ2ZQbnBjaTN3VE9leElZPSJ9LCJlbmFibGVEZWJ1ZyI6dHJ1ZSwiZGV2aWNlT3JpZW50YXRpb24iOiJxx3J0cmFpdCJ9",
                      "listName": "bj",
                      "content-type": "application/json",
                      "idxx": "B41CF5FA70F3DD19B1D87389CF045C8A1614CBEE645A9174BDDFDF1265A56129",
                      "Cookie": "PPU=\"\";idxx=sdfergdshrthfbscaswqr;sessionid=sdddgerhfgjntfyjvzserweagergsderty;",
                      "accuracy": "",
                      "geo": "",
                      "abtest": ""
                  },
                  fail(res){
                      console.log('request fail **** ', res)
                      endFun()
                  },
                  success(res) {
                      console.log('request result ***** ', JSON.stringify(res.data))
                      endFun()
                  },
              })
          }))
      }

      Promise.all(promiseArray)
          .then((result)=>{
              const totalTime = Date.now() - startTime
              const logs: string[] = []

              let serialTime = 0
              result.forEach((value, index)=>{
                  logs.push(`请求${index}的耗时： ${value} ms`)
                  serialTime += value
              })

              logs.push(`并发请求时间：${totalTime}ms，串行请求时间：${serialTime} ms`)
              logs.push(`可能线程数：${serialTime / totalTime}`)
              this.setState({
                  requestHignConcurrentResult: logs.join('\n')
              })
          })
  }
  requestByJsTest=()=>{
      const startTime = Date.now()
      const promiseArray:Promise<number>[] = []
      for (let i=1; i <= 30; i++) {
          promiseArray.push(methodTime((endFun)=>{jsFetch(endFun)}))
      }
      Promise.all(promiseArray)
      .then((result)=>{
          const totalTime = Date.now() - startTime
          const logs: string[] = []

          let serialTime = 0
          result.forEach((value, index)=>{
              logs.push(`请求${index}的耗时： ${value} ms`)
              serialTime += value
          })

          logs.push(`并发请求时间：${totalTime}ms，串行请求时间：${serialTime} ms`)
          logs.push(`可能线程数：${serialTime / totalTime}`)
          this.setState({
              requestByJsResult: logs.join('\n')
          })
      })
  }
  render() {
    const { syncSingleResult, requestSingleResult,requestConcurrentResult,requestHignConcurrentResult,syncResult, requestByJsResult  } = this.state
    return (
      <View className='api-page'>
        <Text className='performance_result'>
          {
            syncSingleResult.split("\n").map((text, index)=>{
              return (
                  <React.Fragment key={index}>
                    {text}
                    <br />
                  </React.Fragment>
              )
            })
          }
        </Text>
        <Button
            onClick={this.syncSingleTest}>
          单次通信
        </Button>
        <Text className='performance_result'>
          {
            syncResult.split("\n").map((text, index)=>{
              return (
                  <React.Fragment key={index}>
                    {text}
                    <br />
                  </React.Fragment>
              )
            })
          }
        </Text>
        <Button
            onClick={this.syncPressureTest}>
          压测：同步调用
        </Button>
        <Text className='performance_result'>
          {
              requestSingleResult.split("\n").map((text, index)=>{
                  return (
                      <React.Fragment key={index}>
                          {text}
                          <br />
                      </React.Fragment>
                  )
              })
          }
        </Text>
        <Button
          onClick={this.requestSingleTest}>
          压测：网络请求-单个
        </Button>
        <Text className='performance_result'>
            {
                requestConcurrentResult.split("\n").map((text, index)=>{
                    return (
                        <React.Fragment key={index}>
                            {text}
                            <br />
                        </React.Fragment>
                    )
                })
            }
        </Text>
        <Button
            onClick={this.requestConcurentTest}>
            压测：网络请求-测试并发数
        </Button>
        <Text className='performance_result'>
            {
                requestHignConcurrentResult.split("\n").map((text, index)=>{
                    return (
                        <React.Fragment key={index}>
                            {text}
                            <br />
                        </React.Fragment>
                    )
                })
            }
        </Text>
        <Button
            onClick={this.requestHignConcurentTest}>
            压测：网络请求-高并发测试
        </Button>
        <Text className='performance_result'>
        {
            requestByJsResult.split("\n").map((text, index)=>{
                return (
                    <React.Fragment key={index}>
                        {text}
                        <br />
                    </React.Fragment>
                )
            })
        }
        </Text>
        <Button
          onClick={this.requestByJsTest}>
          压测：js侧批量网络请求
        </Button>
      </View>
    )
  }
}
