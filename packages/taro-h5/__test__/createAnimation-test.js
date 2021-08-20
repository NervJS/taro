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

/* eslint-disable */
import { createAnimation } from '../src/api/createAnimation'

describe('createAnimation', () => {
  it('test unit', () => {
    const ani = createAnimation()
    const { rules, transform } = ani
    ani.left(10)
    expect(rules[0]).toEqual(`left: 10px`)
    ani.top('10')
    expect(rules[1]).toEqual(`top: 10px`)
    ani.right('10%')
    expect(rules[2]).toEqual(`right: 10%`)
    ani.translate(10, '10%')
    expect(transform[1]).toEqual(`translate(10px, 10%)`)
    ani.translateX('10')
    expect(transform[2]).toEqual(`translateX(10px)`)
    ani.translate3d('10', 10, '20%')
    expect(transform[3]).toEqual(`translate3d(10px, 10px, 20%)`)
  })
})
