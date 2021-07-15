---
title: Routing Features
---

## Routing API Description

In **Taro**, the routing feature comes by default and does not require additional routing configuration by the developer.

We just need to specify `pages` in the `config` configuration of the entry file, and then we can jump to the destination page in our code via the API provided by **Taro**, e.g.

```jsx
// Jump to the destination page and open a new page
Taro.navigateTo({
  url: '/pages/page/path/name'
})

// Jump to the destination page and open on the current page
Taro.redirectTo({
  url: '/pages/page/path/name'
})
```

For specific API descriptions, please see the [navigation](./apis/route/navigateTo)section for instructions.

## Route Passing Parameters

We can do this by adding a query string parameter to all jumps after the `url`, for example

```jsx
// Pass in parameters id=2&type=test
Taro.navigateTo({
  url: '/pages/page/path/name?id=2&type=test'
})

```

In this case, the incoming parameters can be retrieved in the **lifecycle** method of the target page of the successful jump via `getCurrentInstance().router.params`, such as the above jump, in the target page's `componentWillMount` (or Vue's `created`) life cycle of the target page:

```jsx
import { getCurrentInstance } from '@tarojs/taro'
import React, { Component } from 'react'

export default class C extends Component {
  componentDidMount () {
    console.log(getCurrentInstance().router.params) // output { id: 2, type: 'test' }
  }
}
```
