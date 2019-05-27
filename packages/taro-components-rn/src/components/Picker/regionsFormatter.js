const fs = require('fs')

const { provinces, cities, districts } = require('./regions')

fs.writeFileSync('./regions.formatted.tsx', 'export default ' + JSON.stringify(provinces.map((p) => {
  return {
    value: p.name,
    label: p.name,
    code: p.code,
    children: (cities[p.code] || []).map((c) => {
      return {
        value: c.name,
        label: c.name,
        code: c.code,
        children: (districts[c.code] || []).map((d) => {
          return {
            value: d.name,
            label: d.name,
            code: d.code
          }
        })
      }
    })
  }
})))
