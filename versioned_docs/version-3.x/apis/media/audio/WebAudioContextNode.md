---
title: WebAudioContextNode
sidebar_label: WebAudioContextNode
---

一类音频处理模块，不同的Node具备不同的功能，如GainNode(音量调整)等。一个 WebAudioContextNode 可以通过上下文来创建。 

> 目前已经支持以下Node： IIRFilterNode WaveShaperNode ConstantSourceNode ChannelMergerNode OscillatorNode GainNode BiquadFilterNode PeriodicWaveNode BufferSourceNode ChannelSplitterNode ChannelMergerNode DelayNode DynamicsCompressorNode ScriptProcessorNode PannerNode

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/WebAudioContextNode.html)

## 方法

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| positionX | `number` | 右手笛卡尔坐标系中X轴的位置。 |
| positionY | `number` | 右手笛卡尔坐标系中Y轴的位置。 |
| positionZ | `number` | 右手笛卡尔坐标系中Z轴的位置。 |
| forwardX | `number` | 表示监听器的前向系统在同一笛卡尔坐标系中的水平位置，作为位置（位置x，位置和位置和位置）值。 |
| forwardY | `number` | 表示听众的前向方向在同一笛卡尔坐标系中作为位置（位置x，位置和位置和位置）值的垂直位置。 |
| forwardZ | `number` | 表示与position (positionX、positionY和positionZ)值在同一笛卡尔坐标系下的听者前进方向的纵向(前后)位置。 |
| upX | `number` | 表示在与position (positionX、positionY和positionZ)值相同的笛卡尔坐标系中侦听器向前方向的水平位置。 |
| upY | `number` | 表示在与position (positionX、positionY和positionZ)值相同的笛卡尔坐标系中侦听器向上方向的水平位置。 |
| upZ | `number` | 表示在与position (positionX、positionY和positionZ)值相同的笛卡尔坐标系中侦听器向后方向的水平位置。 |

### setOrientation

设置监听器的方向

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

```tsx
(...args: any[]) => void
```

| 参数 | 类型 |
| --- | --- |
| args | `any[]` |

### setPosition

设置监听器的位置

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

```tsx
(...args: any[]) => void
```

| 参数 | 类型 |
| --- | --- |
| args | `any[]` |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| WebAudioContextNode | ✔️ |  |  |
| WebAudioContextNode.setOrientation | ✔️ |  |  |
| WebAudioContextNode.setPosition | ✔️ |  |  |
