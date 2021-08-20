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

const geolocation = {
  getCurrentPosition (callback) {
    const res = {}
    const coords = {
      latitude: 0,
      longitude: 0,
      speed: 0,
      accuracy: 0,
      altitude: 0
    }
    res.coords = coords
    res.timestamp = Date.now()
    callback && callback(res)
  }
}

const navigator = {}
navigator.geolocation = geolocation

export default navigator
