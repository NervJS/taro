import * as fs from 'fs-extra'

let compile
let getOutput

const fileType = {
  templ: '.wxml',
  style: '.wxss',
  config: '.json',
  script: '.js',
  xs: '.wxs'
}

jest.mock('vm2', () => ({
  NodeVM: jest.fn().mockImplementation(() => {
    return {
      run: jest.fn().mockImplementation((code) => {
        if (code.includes('others/detail/index')) {
          return cb => cb({'root.cn.[0]':{'nn':'view','uid':'_n_15','cn':[{'nn':'view','uid':'_n_10','cn':[{'nn':'picker','uid':'_n_9','mode':'multiSelector','range':[['北京市','天津市','上海市','重庆市','河北省','山西省','内蒙古','辽宁省','吉林省','黑龙江省','江苏省','浙江省','安徽省','福建省','江西省','山东省','河南省','湖北省','湖南省','广东省','广西','海南省','四川省','贵州省','云南省','西藏','陕西省','甘肃省','青海省','宁夏','新疆','香港','澳门','台湾省'],['北京市'],['东城区','西城区','崇文区','宣武区','朝阳区','丰台区','石景山区','海淀区','门头沟区','房山区','通州区','顺义区','昌平区','大兴区','怀柔区','平谷区','密云县','延庆县','延庆镇']],'value':[0,0,0],'cn':[{'nn':'view','uid':'_n_8','cn':[{'nn':'text','uid':'_n_7','cn':[{'v':'请选择省市区','nn':'#text'}]}],'st':'width: 100%;height: 44px;'}]}],'cl':'taro-region-picker taro-region-picker-gray'},{'nn':'view','uid':'_n_14','disablePrerender':true,'cn':[{'nn':'view','uid':'_n_13','cn':[{'nn':'text','uid':'_n_12','cn':[{'v':'No need to be prerender.','nn':'#text'}]}]}]}]},'root.uid':'others/detail/index?'})
        } else if (code.includes('pages/index/index')) {
          return cb => cb({'root.cn.[0]':{'nn':'view','uid':'_n_19','cn':[{'nn':'text','uid':'_n_18','cn':[{'v':'Hello world!','nn':'#text'}]}],'cl':'index'},'root.uid':'pages/index/index?'})
        } else {
          return cb => cb({})
        }
      })
    }
  })
}))

describe('prerender', () => {
  beforeAll(() => {
    jest.unmock('webpack')
  })

  beforeEach(() => {
    jest.isolateModules(() => {
      const compiler = require('./utils/compiler')
      compile = compiler.compile
      getOutput = compiler.getOutput
    })
  })

  test('should prerender selected pages', async () => {
    const { stats, config } = await compile('prerender', {
      fileType,
      prerender: {
        match: 'others/**',
        include: ['pages/index/index'],
        exclude: ['others/normal/index']
      }
    })
    const assets = stats.toJson().assets

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, { ...config, fs })
    expect(output).toMatchSnapshot()
  })

  test('should transform dom tree', async () => {
    const { stats, config } = await compile('prerender', {
      fileType,
      prerender: {
        match: 'others/**',
        include: ['pages/index/index'],
        exclude: ['others/normal/index'],
        transformData (data, { path }) {
          if (path === 'others/detail/index') {
            data.nn = 'video'
            data.cn = []
            data.src = 'https://pornhub.com/av8871239'
            return data
          }

          return data
        }
      }
    })
    const assets = stats.toJson().assets

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, { ...config, fs })
    expect(output).toMatchSnapshot()
  })

  test('should transform result xml', async () => {
    const { stats, config } = await compile('prerender', {
      fileType,
      prerender: {
        match: 'others/**',
        include: ['pages/index/index'],
        exclude: ['others/normal/index'],
        transformXML (data, { path }, xml) {
          if (path === 'others/detail/index') {
            return '<video src="https://pornhub.com/av8871239" />'
          }

          return xml
        }
      }
    })
    const assets = stats.toJson().assets

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, { ...config, fs })
    expect(output).toMatchSnapshot()
  })

  test('should throw error', async () => {
    const originLogError = console.error
    const logError = jest.fn()
    console.error = logError
    await compile('prerender', {
      fileType,
      prerender: {
        match: 'others/normal/index'
      }
    })
    expect(logError).toHaveBeenCalledWith(new Error('初始化渲染没有任何数据。'))
    console.error = originLogError
  })
})
