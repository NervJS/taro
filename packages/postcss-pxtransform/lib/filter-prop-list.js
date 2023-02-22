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
 *  SOFTWARE.
 */

/*eslint-disable*/
module.exports = {
  exact: function (list) {
    return list.filter(function (m) {
      return m.match(/^[^\*\!]+$/)
    })
  },
  contain: function (list) {
    return list.filter(function (m) {
      return m.match(/^\*.+\*$/)
    }).map(function (m) {
      return m.substr(1, m.length - 2)
    })
  },
  endWith: function (list) {
    return list.filter(function (m) {
      return m.match(/^\*[^\*]+$/)
    }).map(function (m) {
      return m.substr(1)
    })
  },
  startWith: function (list) {
    return list.filter(function (m) {
      return m.match(/^[^\*\!]+\*$/)
    }).map(function (m) {
      return m.substr(0, m.length - 1)
    })
  },
  notExact: function (list) {
    return list.filter(function (m) {
      return m.match(/^\![^\*].*$/)
    }).map(function (m) {
      return m.substr(1)
    })
  },
  notContain: function (list) {
    return list.filter(function (m) {
      return m.match(/^\!\*.+\*$/)
    }).map(function (m) {
      return m.substr(2, m.length - 3)
    })
  },
  notEndWith: function (list) {
    return list.filter(function (m) {
      return m.match(/^\!\*[^\*]+$/)
    }).map(function (m) {
      return m.substr(2)
    })
  },
  notStartWith: function (list) {
    return list.filter(function (m) {
      return m.match(/^\![^\*]+\*$/)
    }).map(function (m) {
      return m.substr(1, m.length - 2)
    })
  }
}
