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
