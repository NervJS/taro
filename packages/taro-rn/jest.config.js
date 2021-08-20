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
  ...require('jest-expo/jest-preset'),
  verbose: true,
  preset: 'react-native',
  modulePathIgnorePatterns: [
    '<rootDir>/TCRNExample'
  ],
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testMatch: ['<rootDir>/src/__tests__/geolocation.test.js'],
  transformIgnorePatterns: ['node_modules/(?!(react-native|@react-native|static-container|react-native-.*|expo-.*|@expo/.*|@unimodules/.*|unimodules-.*|@react-native-community/.*)/)'],
  setupFilesAfterEnv: ['./setup.js'],
  testEnvironment: 'enzyme',
  testEnvironmentOptions: {
    enzymeAdapter: 'react16'
  }
}
