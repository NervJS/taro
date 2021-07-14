---
title: IntersectionObserver
sidebar_label: IntersectionObserver
---

An `IntersectionObserver` object that infers whether and how likely certain nodes are visible to users.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/wxml/IntersectionObserver.html)

## Methods

### disconnect

Stops listening, and the callback function will no longer be triggered.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/wxml/IntersectionObserver.disconnect.html)

```tsx
() => void
```

### observe

Specifies the target node and starts listening on changes in the intersection status.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/wxml/IntersectionObserver.observe.html)

```tsx
(targetSelector: string, callback: ObserveCallback) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>targetSelector</td>
      <td><code>string</code></td>
      <td>Selector</td>
    </tr>
    <tr>
      <td>callback</td>
      <td><code>ObserveCallback</code></td>
      <td>The callback function for listening on intersection status changes.</td>
    </tr>
  </tbody>
</table>

### relativeTo

Uses a selector to specify a node as one of the reference areas.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/wxml/IntersectionObserver.relativeTo.html)

```tsx
(selector: string, margins?: RelativeToMargins) => IntersectionObserver
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>selector</td>
      <td><code>string</code></td>
      <td>Selector</td>
    </tr>
    <tr>
      <td>margins</td>
      <td><code>RelativeToMargins</code></td>
      <td>Expands/Contracts the border of the layout area of the reference node.</td>
    </tr>
  </tbody>
</table>

### relativeToViewport

Specifies the page display area as one of the reference areas.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/wxml/IntersectionObserver.relativeToViewport.html)

```tsx
(margins?: RelativeToViewportMargins) => IntersectionObserver
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>margins</td>
      <td><code>RelativeToViewportMargins</code></td>
      <td>Expands/Contracts the border of the layout area of the reference node.</td>
    </tr>
  </tbody>
</table>

#### Sample Code

In the code sample below, the callback function is triggered if the target node (specified by the selector .target-class) enters the area 100 px below the display area.

```tsx
Taro.createIntersectionObserver().relativeToViewport({bottom: 100}).observe('.target-class', (res) => {
  res.intersectionRatio // The percentage of the intersection area in the layout area of the target node
  res.intersectionRect // Intersection area
  res.intersectionRect.left // Left boundary coordinates of the intersection area
  res.intersectionRect.top // Upper boundary coordinates of the intersection area
  res.intersectionRect.width // Width of the intersection area
  res.intersectionRect.height // Height of the intersection area
})
```

## Parameters

### ObserveCallback

The callback function for listening on intersection status changes.

```tsx
(result: ObserveCallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>result</td>
      <td><code>ObserveCallbackResult</code></td>
    </tr>
  </tbody>
</table>

### ObserveCallbackResult

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>boundingClientRect</td>
      <td><code>BoundingClientRectResult</code></td>
      <td>The target border</td>
    </tr>
    <tr>
      <td>intersectionRatio</td>
      <td><code>number</code></td>
      <td>Intersection ratio</td>
    </tr>
    <tr>
      <td>intersectionRect</td>
      <td><code>IntersectionRectResult</code></td>
      <td>The border of the intersection area</td>
    </tr>
    <tr>
      <td>relativeRect</td>
      <td><code>RelativeRectResult</code></td>
      <td>The border of the reference area</td>
    </tr>
    <tr>
      <td>time</td>
      <td><code>number</code></td>
      <td>The timestamp for intersection detection</td>
    </tr>
  </tbody>
</table>

### RelativeRectResult

参照区域的边界

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>bottom</td>
      <td><code>number</code></td>
      <td>Lower border of the node layout area</td>
    </tr>
    <tr>
      <td>left</td>
      <td><code>number</code></td>
      <td>Left border of the node layout area</td>
    </tr>
    <tr>
      <td>right</td>
      <td><code>number</code></td>
      <td>Right border of the node layout area</td>
    </tr>
    <tr>
      <td>top</td>
      <td><code>number</code></td>
      <td>Upper border of the node layout area</td>
    </tr>
  </tbody>
</table>

### IntersectionRectResult

相交区域的边界

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>bottom</td>
      <td><code>number</code></td>
      <td>Lower border</td>
    </tr>
    <tr>
      <td>left</td>
      <td><code>number</code></td>
      <td>Left border</td>
    </tr>
    <tr>
      <td>right</td>
      <td><code>number</code></td>
      <td>Right border</td>
    </tr>
    <tr>
      <td>top</td>
      <td><code>number</code></td>
      <td>Upper border</td>
    </tr>
    <tr>
      <td>height</td>
      <td><code>number</code></td>
      <td>Height</td>
    </tr>
    <tr>
      <td>width</td>
      <td><code>number</code></td>
      <td>Width</td>
    </tr>
  </tbody>
</table>

### BoundingClientRectResult

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>bottom</td>
      <td><code>number</code></td>
      <td>Lower border</td>
    </tr>
    <tr>
      <td>left</td>
      <td><code>number</code></td>
      <td>Left border</td>
    </tr>
    <tr>
      <td>right</td>
      <td><code>number</code></td>
      <td>Right border</td>
    </tr>
    <tr>
      <td>top</td>
      <td><code>number</code></td>
      <td>Upper border</td>
    </tr>
    <tr>
      <td>height</td>
      <td><code>number</code></td>
      <td>Height</td>
    </tr>
    <tr>
      <td>width</td>
      <td><code>number</code></td>
      <td>Width</td>
    </tr>
  </tbody>
</table>

### RelativeToMargins

Expands/Contracts the border of the layout area of the reference node.

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
      <td>bottom</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Lower border of the node layout area</td>
    </tr>
    <tr>
      <td>left</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Left border of the node layout area</td>
    </tr>
    <tr>
      <td>right</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Right border of the node layout area</td>
    </tr>
    <tr>
      <td>top</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Upper border of the node layout area</td>
    </tr>
  </tbody>
</table>

### RelativeToViewportMargins

Expands/Contracts the border of the layout area of the reference node.

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
      <td>bottom</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Lower border of the node layout area</td>
    </tr>
    <tr>
      <td>left</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Left border of the node layout area</td>
    </tr>
    <tr>
      <td>right</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Right border of the node layout area</td>
    </tr>
    <tr>
      <td>top</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Upper border of the node layout area</td>
    </tr>
  </tbody>
</table>
