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
