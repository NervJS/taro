/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

import * as Taro from '@tarojs/taro-h5'

describe('createAnimation', () => {
  it('test unit', () => {
    const ani: any = Taro.createAnimation()
    const { rules, transform } = ani
    ani.left(10)
    expect(rules[0]).toEqual('left: 10px')
    ani.top('10')
    expect(rules[1]).toEqual('top: 10px')
    ani.right('10%')
    expect(rules[2]).toEqual('right: 10%')
    ani.translate(10, '10%')
    expect(transform[1]).toEqual('translate(10px, 10%)')
    ani.translateX('10')
    expect(transform[2]).toEqual('translateX(10px)')
    ani.translate3d('10', 10, '20%')
    expect(transform[3]).toEqual('translate3d(10px, 10px, 20%)')
  })
})
