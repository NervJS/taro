module.exports = {
  validators: [
    require('./configValidator'),
    require('./packageValidator'),
    require('./recommandValidator'),
    require('./eslintValidator')
  ]
}
