/*
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

module.exports = {
  detailMock: {
    'root.cn.[0]': {
      nn: 'view',
      uid: '_n_15',
      cn: [
        {
          nn: 'view',
          uid: '_n_10',
          cn: [
            {
              nn: 'picker',
              uid: '_n_9',
              mode: 'multiSelector',
              range: [
                [
                  '北京市',
                  '天津市',
                  '上海市',
                  '重庆市',
                  '河北省',
                  '山西省',
                  '内蒙古',
                  '辽宁省',
                  '吉林省',
                  '黑龙江省',
                  '江苏省',
                  '浙江省',
                  '安徽省',
                  '福建省',
                  '江西省',
                  '山东省',
                  '河南省',
                  '湖北省',
                  '湖南省',
                  '广东省',
                  '广西',
                  '海南省',
                  '四川省',
                  '贵州省',
                  '云南省',
                  '西藏',
                  '陕西省',
                  '甘肃省',
                  '青海省',
                  '宁夏',
                  '新疆',
                  '香港',
                  '澳门',
                  '台湾省'
                ],
                ['北京市'],
                [
                  '东城区',
                  '西城区',
                  '崇文区',
                  '宣武区',
                  '朝阳区',
                  '丰台区',
                  '石景山区',
                  '海淀区',
                  '门头沟区',
                  '房山区',
                  '通州区',
                  '顺义区',
                  '昌平区',
                  '大兴区',
                  '怀柔区',
                  '平谷区',
                  '密云县',
                  '延庆县',
                  '延庆镇'
                ]
              ],
              value: [0, 0, 0],
              cn: [
                {
                  nn: 'view',
                  uid: '_n_8',
                  cn: [{ nn: 'text', uid: '_n_7', cn: [{ v: '请选择省市区', nn: '#text' }] }],
                  st: 'width: 100%;height: 44px;'
                }
              ]
            }
          ],
          cl: 'taro-region-picker taro-region-picker-gray'
        },
        {
          nn: 'view',
          uid: '_n_14',
          disablePrerender: true,
          cn: [
            {
              nn: 'view',
              uid: '_n_13',
              cn: [{ nn: 'text', uid: '_n_12', cn: [{ v: 'No need to be prerender.', nn: '#text' }] }]
            }
          ]
        }
      ]
    },
    'root.uid': 'others/detail/index?'
  },
  indexMock: {
    'root.cn.[0]': {
      nn: 'view',
      uid: '_n_19',
      cn: [{ nn: 'text', uid: '_n_18', cn: [{ v: 'Hello world!', nn: '#text' }] }],
      cl: 'index'
    },
    'root.uid': 'pages/index/index?'
  }
}
