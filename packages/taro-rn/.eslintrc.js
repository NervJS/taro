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
  root: true,
  extends: [
    'standard',
    'plugin:react/recommended',
    'plugin:jest/recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  env: {
    node: true,
    jest: true,
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    'comma-dangle': [2, 'only-multiline'],
    '@typescript-eslint/class-name-casing': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/ban-ts-ignore': 0,
    '@typescript-eslint/no-use-before-define': 2,
    'no-use-before-define': 0,
    'space-before-function-paren': 0,
    'react/display-name': 0,
    '@typescript-eslint/no-explicit-any': 0
  }
}
