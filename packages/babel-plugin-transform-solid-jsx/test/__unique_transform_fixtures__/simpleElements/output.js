import { insert as _$insert } from 'r-custom'
import { createTextNode as _$createTextNode } from 'r-custom'
import { insertNode as _$insertNode } from 'r-custom'
import { setProp as _$setProp } from 'r-custom'
import { createElement as _$createElement } from 'r-custom'
import { Button, Icon, Text, View } from '@tarojs/components'
export default function Index() {
  return (() => {
    var _el$ = _$createElement('view'),
      _el$2 = _$createElement('view'),
      _el$3 = _$createElement('text'),
      _el$5 = _$createElement('view'),
      _el$6 = _$createElement('text'),
      _el$8 = _$createElement('button'),
      _el$10 = _$createElement('view'),
      _el$11 = _$createElement('icon')
    _$insertNode(_el$, _el$2)
    _$insertNode(_el$, _el$5)
    _$insertNode(_el$, _el$8)
    _$insertNode(_el$, _el$10)
    _$insertNode(_el$, _el$11)
    _$setProp(_el$, 'class', 'index')
    _$insertNode(_el$2, _el$3)
    _$insertNode(_el$3, _$createTextNode(`Hello world! `))
    _$insertNode(_el$5, _el$6)
    _$insertNode(_el$6, _$createTextNode(`Hello world2! `))
    _$insertNode(_el$8, _$createTextNode(`set class`))
    _$insert(_el$10, () => Math.random())
    _$setProp(_el$11, 'type', 'success')
    return _el$
  })()
}