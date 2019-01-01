export default {
  validators: [
    require('./configValidator'),
    require('./packageValidator'),
    require('./recommandValidator'),
    require('./eslintValidator')
  ]
}
