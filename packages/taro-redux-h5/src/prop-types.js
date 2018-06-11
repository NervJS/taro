function proptype () { }
proptype.isRequired = proptype

const getProptype = () => proptype

const PropTypes = {
  element: getProptype,
  func: getProptype,
  shape: getProptype,
  instanceOf: getProptype
}

export default PropTypes
