/*
本测试用于对华为原子化服务的配置文件ability.xml进行校验。
ability.xml所需声明内容包括：
1、ability用于声明应用内服务，intent属性用于叫起该服务；
2、display为可选项，用于声明服务页面展示信息；
3、service用于声明提供对应服务的页面；
4、parameter用于声明启动服务所需要的参数信息。

文件格式样式举例如下：
*******************************************************************************************************************
<?xml version="1.0" encoding="utf-8"?>
<aml version="1"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="ability.xsd">
  <ability intent="ability.intent.ORDER_MOVIE">
    <display name="电影票预定" icon="Common/ticket.png" description="电影票预定"/>
    <service link="hap://app/com.huawei.www/movie/order">
      <parameter linkParameter="movieName" intentParameter="movieName" testValue="狮子王" urlEncoding="false"/>
    </service>
  </ability>
  <ability intent="ability.intents.ORDER_TAXI">
    <display name="打车" icon="Common/taxi.png" description="打车"/>
    <service link="hap://app/com.huawei.www/taxi/order">
      <parameter linkParameter="dstLocation" intentParameter="dstLocation" testValue="南京站" urlEncoding="false"/>
    </service>
  </ability>
</aml>
******************************************************************************************************************

详细配置规范请参考华为开发者网站：developer.huawei.com
*/

import * as _ from 'lodash/fp'
import * as fs from 'fs-extra'
import * as path from 'path'
import { chalk } from '@tarojs/helper'

import { IErrorLine } from './interface'

const xml2js = require('xml2js')

const ABILITYXML = ['ability.xml']

export default async function ({ appPath }) {
  const PROJECT_PACKAGE_PATH = path.join(appPath, 'package.json')
  const PROJECT_FOLDER_FILES = fs.readdirSync('./')
  if (!fs.existsSync(PROJECT_PACKAGE_PATH)) {
    console.log(chalk.red(`找不到${PROJECT_PACKAGE_PATH}，请确定当前目录是Taro项目根目录!`))
    process.exit(1)
  }

  const inProjectFolder = filenames => (_.intersectionBy(_.toLower, PROJECT_FOLDER_FILES, filenames)).length > 0
  const hasAbilityXML = inProjectFolder(ABILITYXML)

  const errorLines: IErrorLine[] = []

  if (!hasAbilityXML) {
    errorLines.push({
      desc: '没有检查到 ability.xml, 编写 ability.xml可以让其他应用方便地叫起应用内服务',
      valid: true
    })
  } else {
    const PROJECT_ABILITY_FILE_PATH = path.join(appPath, 'ability.xml')
    const data = fs.readFileSync(PROJECT_ABILITY_FILE_PATH)

    xml2js.parseString(data, function(err, result){
      // 解析ability.xml配置文件
      if (err) {
        errorLines.push({
          desc: 'ability.xml 解析错误，请检查文件格式！',
          valid: true
        })
      } else {
        // 检查ability配置
        const abilities = result.aml.ability;
        if (abilities == null) {
          errorLines.push({
            desc: '没有发现 ability声明, 请检查是否定义完整',
            valid: true
          })
        } else {
          // 检查intent声明合法性
          const intentRegex = /ability.intent.[0-9A-Z_]+$/ // intent匹配规则
          const parameterRegex = /^[A-Za-z0-9_]+$/ // parameter匹配规则

          for(const x in abilities){
            const abilityIndex = parseInt(x, 10) + 1

            // 检查intent声明
            if(!intentRegex.test(abilities[x].$.intent)){
              errorLines.push({
                desc: '第'+abilityIndex+'个ability的intent格式错误',
                valid: true,
                solution: 'intent 必须声明为格式为ability.intent.xxx的字符串，xxx可以包含数字，大写字母和下划线'
              })
            }

            // 检查service的parameter声明合法性
            const services = abilities[x].service;

            if (services == null) {
              errorLines.push({
              desc: '第'+abilityIndex+'个ability没有发现 service声明, 请检查是否定义完整',
              valid: true
              })
            } else {
              for (const y in services) {
                const serviceIndex = parseInt(y, 10) + 1

                // 校验linkParameter
                if(!parameterRegex.test(services[y].parameter[0].$.linkParameter)){
                  errorLines.push({
                    desc: '第'+abilityIndex+'个ability的第'+serviceIndex+'个service linkParameter 格式错误',
                    valid: true,
                    solution: 'linkParameter 只能包含数字，大写字母，小写字母和下划线'
                  })
                }

                // 校验intentParameter
                if(!parameterRegex.test(services[y].parameter[0].$.intentParameter)){
                  errorLines.push({
                    desc: '第'+abilityIndex+'个ability的第'+serviceIndex+'个service intentParameter 格式错误',
                    valid: true,
                    solution: 'intentParameter 只能包含数字，大写字母，小写字母和下划线'
                  })
                }
              }
            }
          }
        }
      }
    })
  }

  return {
    desc: '检查原子化服务规范',
    lines: errorLines
  }
}
