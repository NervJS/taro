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

const { add } = require('../../utils/util')

Page({
  data: {
    text: 'This is page data.',
    x: add(1, 2)
  },
  created (options) {
    console.log(options)
    // Do some initialize when page load.
  },
  onReady () {
    // console.log(this.selectComponent())
    // Do something when page ready.
  },
  // Event handler.
  viewTap () {
    this.setData({
      text: 'Set some data for updating view.'
    }, function() {
      // this is setData callback
    })
  },

  handler (e) {
    console.log(e)
  },
  customData: {
    hi: 'MINA'
  }
})
