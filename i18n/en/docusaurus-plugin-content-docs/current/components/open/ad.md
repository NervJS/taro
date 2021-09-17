---
title: Ad
sidebar_label: Ad
---

Banner ad.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/component/ad.html)

## Type

```tsx
ComponentType<AdProps>
```

## Examples

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
  defaultValue="React"
  values={[
    {label: 'React', value: 'React'},
    {label: 'Vue', value: 'Vue'}
  ]}>
<TabItem value="React">

```tsx
class App extends Component {
  render () {
    return (
      <Ad
        unitId=''
        adIntervals={60}
        onLoad={() => console.log('ad onLoad')}
        onError={() => console.log('ad onError')}
        onClose={() => console.log('ad onClose')}
      />
    )
  }
}
```
</TabItem>

<TabItem value="Vue">

```html
<template>
  <ad
    unit-id=""
    ad-intervals="60"
    @load="onLoad"
    @error="onError"
    @close="onClose"
  />
</template>
```
  
</TabItem>
</Tabs>


## AdProps

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>unitId</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>d unit ID, which can be created via the Ad Host module in<a href="https://mp.weixin.qq.com/?lang=en_US&token="> Mini Program Console</a>.</td>
    </tr>
    <tr>
      <td>adIntervals</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The interval between the automatic refresh of the advertisements in seconds, the value of the parameter must be greater than or equal to 30.（Banner ads are not refreshed automatically if this parameter is not set.）</td>
    </tr>
    <tr>
      <td>onLoad</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Callback used when an ad is loaded</td>
    </tr>
    <tr>
      <td>onError</td>
      <td><code>BaseEventOrigFunction&lt;onErrorEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Callback used when ad loading failed. event.detail = {`{errCode: 1002}`}</td>
    </tr>
    <tr>
      <td>onClose</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Callback used when an ad is closed</td>
    </tr>
  </tbody>
</table>

### Property Support

| Property | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| AdProps.unitId | ✔️ |  |  |
| AdProps.adIntervals | ✔️ |  |  |
| AdProps.onLoad | ✔️ |  |  |
| AdProps.onError | ✔️ |  |  |
| AdProps.onClose | ✔️ |  |  |

### onErrorEventDetail

<table>
  <thead>
    <tr>
      <th>Param</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>errCode</td>
      <td><code>1000 | 1001 | 1002 | 1003 | 1004 | 1005 | 1006 | 1007 | 1008</code></td>
    </tr>
  </tbody>
</table>

### AdErrCode

An error code is obtained by executing the binderror callback.

<table>
  <thead>
    <tr>
      <th>Code</th>
      <th style={{ textAlign: "center"}}>Exception</th>
      <th style={{ textAlign: "center"}}>Cause</th>
      <th style={{ textAlign: "center"}}>Solution</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1000</td>
      <td style={{ textAlign: "center"}}><code>Call failed due to a backend error</code></td>
      <td style={{ textAlign: "center"}}><code>This error is not caused by developers.</code></td>
      <td style={{ textAlign: "center"}}><code>Ignore the error, and it will be automatically recovered after a period of time.</code></td>
    </tr>
    <tr>
      <td>1001</td>
      <td style={{ textAlign: "center"}}><code>Parameter error</code></td>
      <td style={{ textAlign: "center"}}><code>The parameter is incorrectly used.</code></td>
      <td style={{ textAlign: "center"}}><code>For details, visit developers.weixin.qq.com. (There are different courses specific to Mini Programs and Mini Games. In the top tab, you can switch between the courses on the right of the <strong>Design</strong> column.)
</code></td>
    </tr>
    <tr>
      <td>1002</td>
      <td style={{ textAlign: "center"}}><code>Invalid ad unit</code></td>
      <td style={{ textAlign: "center"}}><code>The spelling may be incorrect or the ad ID of another app may be used.</code></td>
      <td style={{ textAlign: "center"}}><code>Visit mp.weixin.qq.com to confirm the ad ID.</code></td>
    </tr>
    <tr>
      <td>1003</td>
      <td style={{ textAlign: "center"}}><code>Internal error</code></td>
      <td style={{ textAlign: "center"}}><code>This error is not caused by developers.</code></td>
      <td style={{ textAlign: "center"}}><code>Ignore the error, and it will be automatically recovered after a period of time.</code></td>
    </tr>
    <tr>
      <td>1004</td>
      <td style={{ textAlign: "center"}}><code>No suitable ad</code></td>
      <td style={{ textAlign: "center"}}><code>The ad does not appear every time. Maybe it is not appropriate to the user.</code></td>
      <td style={{ textAlign: "center"}}><code>This is a normal case. In addition, you need to improve compatibility in this case.</code></td>
    </tr>
    <tr>
      <td>1005</td>
      <td style={{ textAlign: "center"}}><code>The ad component is being reviewed.</code></td>
      <td style={{ textAlign: "center"}}><code>Your ad is being reviewed and therefore cannot be displayed.</code></td>
      <td style={{ textAlign: "center"}}><code>Visit mp.weixin.qq.com to check the review status. In addition, you need to improve compatibility in this case.</code></td>
    </tr>
    <tr>
      <td>1006</td>
      <td style={{ textAlign: "center"}}><code>The ad component is rejected.</code></td>
      <td style={{ textAlign: "center"}}><code>Your ad failed to pass the review and therefore cannot be displayed.</code></td>
      <td style={{ textAlign: "center"}}><code>Visit mp.weixin.qq.com to check the review status. In addition, you need to improve compatibility in this case.</code></td>
    </tr>
    <tr>
      <td>1007</td>
      <td style={{ textAlign: "center"}}><code>The ad component is rejected.</code></td>
      <td style={{ textAlign: "center"}}><code>Your advertising capability is suspended. ads cannot be displayed during the suspension.</code></td>
      <td style={{ textAlign: "center"}}><code>Visit mp.weixin.qq.com to check the Mini Program ad suspension status.</code></td>
    </tr>
    <tr>
      <td>1008</td>
      <td style={{ textAlign: "center"}}><code>The ad unit is disabled.</code></td>
      <td style={{ textAlign: "center"}}><code>The advertising capability in the advertising space is disabled.</code></td>
      <td style={{ textAlign: "center"}}><code>Visit mp.weixin.qq.com to enable the display in the advertising space.</code></td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Ad | ✔️ |  |  |
