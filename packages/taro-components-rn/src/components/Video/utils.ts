/*!
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

export const formatTime = (time: number): string => {
  if (time === null) return ''
  const sec = Math.round(time / 1000 % 60)
  const min = Math.floor((time - sec) / 1000 / 60)
  return `${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`
}

export const calcDist = (x: number, y: number): number => {
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
}

export const normalizeNumber = (number: number): number => {
  return Math.max(-1, Math.min(number, 1))
}
