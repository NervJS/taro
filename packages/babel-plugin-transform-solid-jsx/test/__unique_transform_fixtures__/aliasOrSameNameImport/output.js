import { insert as _$insert } from 'r-custom'
import { createComponent as _$createComponent } from 'r-custom'
import { createTextNode as _$createTextNode } from 'r-custom'
import { insertNode as _$insertNode } from 'r-custom'
import { setProp as _$setProp } from 'r-custom'
import { createElement as _$createElement } from 'r-custom'
import { Button, Icon, Text, View as MyView } from '@tarojs/components'
import { Input, RenderWithChildren, RenderWithSlot } from 'somewhere'
export default function Index() {
  return (() => {
    var _el$ = _$createElement('view'),
      _el$2 = _$createElement('view'),
      _el$3 = _$createElement('text'),
      _el$5 = _$createElement('view'),
      _el$6 = _$createElement('text'),
      _el$8 = _$createElement('button'),
      _el$0 = _$createElement('view'),
      _el$1 = _$createElement('icon')
    _$insertNode(_el$, _el$2)
    _$insertNode(_el$, _el$5)
    _$insertNode(_el$, _el$8)
    _$insertNode(_el$, _el$0)
    _$insertNode(_el$, _el$1)
    _$setProp(_el$, 'class', 'index')
    _$insertNode(_el$2, _el$3)
    _$insertNode(_el$3, _$createTextNode(`Hello world! `))
    _$insertNode(_el$5, _el$6)
    _$insertNode(_el$6, _$createTextNode(`Hello world2! `))
    _$insertNode(_el$8, _$createTextNode(`set class`))
    _$insert(_el$, _$createComponent(Input, {}), _el$0)
    _$insert(_el$0, () => Math.random())
    _$setProp(_el$1, 'type', 'success')
    _$insert(
      _el$,
      _$createComponent(RenderWithSlot, {
        get header() {
          return _$createElement('view')
        },
      }),
      null
    )
    _$insert(
      _el$,
      _$createComponent(RenderWithSlot, {
        get header() {
          return (() => {
            var _el$22 = _$createElement('button')
            _$insertNode(_el$22, _$createTextNode(`button`))
            return _el$22
          })()
        },
      }),
      null
    )
    _$insert(
      _el$,
      _$createComponent(RenderWithSlot, {
        get header() {
          return _$createComponent(Input, {})
        },
      }),
      null
    )
    _$insert(
      _el$,
      _$createComponent(RenderWithChildren, {
        get children() {
          var _el$10 = _$createElement('button')
          _$insertNode(_el$10, _$createTextNode(`RenderWithChildren1`))
          return _el$10
        },
      }),
      null
    )
    _$insert(
      _el$,
      _$createComponent(RenderWithChildren, {
        get children() {
          var _el$12 = _$createElement('view')
          _$insertNode(_el$12, _$createTextNode(`RenderWithChildren2`))
          return _el$12
        },
      }),
      null
    )
    _$insert(
      _el$,
      _$createComponent(RenderWithChildren, {
        get children() {
          var _el$14 = _$createElement('button'),
            _el$15 = _$createElement('view')
          _$insertNode(_el$14, _el$15)
          _$insertNode(_el$15, _$createTextNode(`variant1`))
          return _el$14
        },
      }),
      null
    )
    _$insert(
      _el$,
      _$createComponent(RenderWithChildren, {
        get children() {
          var _el$17 = _$createElement('view'),
            _el$18 = _$createElement('button')
          _$insertNode(_el$17, _el$18)
          _$insertNode(_el$18, _$createTextNode(`variant2`))
          return _el$17
        },
      }),
      null
    )
    _$insert(
      _el$,
      _$createComponent(RenderWithChildren, {
        get children() {
          var _el$20 = _$createElement('view')
          _$insert(_el$20, _$createComponent(Input, {}))
          return _el$20
        },
      }),
      null
    )
    return _el$
  })()
}