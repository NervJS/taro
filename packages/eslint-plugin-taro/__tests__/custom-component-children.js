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

const rule = require('../rules/custom-component-children')
const { RuleTester } = require('eslint')
const { parserOptions, testComponent } = require('../utils/utils')

const ruleTester = new RuleTester({ parserOptions })

const ERROR_MESSAGE = '不能在自定义组件中写 children'

ruleTester.run('custom-component-children', rule, {
  valid: [{
    code: testComponent('<View />')
  }, {
    code: testComponent('<View>test</View>')
  }, {
    code: testComponent('<ScrollView>test</ScrollView>')
  }, {
    code: testComponent('<View>{\'test\'}</View>')
  }, {
    code: testComponent(`<View>
      <CustomComponent />
    </View>`)
  }, {
    code: testComponent('<CustomComponent />')
  }, {
    code: testComponent('<CustomComponent> </CustomComponent>')
  }, {
    code: testComponent(`<CustomComponent> 
    
    </CustomComponent>`)
  }, {
    code: testComponent('<Provider><Index /></Provider>')
  }, {
    code: testComponent('<Provider>{\'test\'}</Provider>')
  }, {
    code: testComponent('<CoverImage>{\'test\'}</CoverImage>')
  }],
  invalid: [{
    code: testComponent('<CustomComponent>test</CustomComponent>'),
    errors: [{ message: ERROR_MESSAGE }]
  }, {
    code: testComponent('<CustomComponent>{\'test\'}</CustomComponent>'),
    errors: [{ message: ERROR_MESSAGE }]
  }, {
    code: testComponent(`<CustomComponent>
      <Other />
    </CustomComponent>`),
    errors: [{ message: ERROR_MESSAGE }]
  }, {
    code: testComponent('<Typo>{}</Typo>'),
    errors: [{ message: ERROR_MESSAGE }]
  }]
})
