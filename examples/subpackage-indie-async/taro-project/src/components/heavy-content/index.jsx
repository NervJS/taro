import { Image, Text, View } from '@tarojs/components'
import { sum, label } from './helper'
import './index.scss'
import logo from './logo.png'

const HEAVY_DEEP_LABELS = ['重组件容器', '异步分包层级', '业务卡片', '状态反馈区', '业务行容器', '样式命中层']

function renderHeavyDeepTree (level, maxLevel) {
  const label = HEAVY_DEEP_LABELS[level] || '深层业务容器'
  if (level >= maxLevel) {
    return (
      <View className="heavy-deep-node heavy-deep-leaf">
        <Text className="heavy-deep-title heavy-text-primary">H{level} 样式命中叶子节点</Text>
        <Text className="heavy-deep-copy heavy-text-secondary">
          异步分包内深层嵌套到第 {level} 层，后代选择器仍应稳定命中。
        </Text>
      </View>
    )
  }
  return (
    <View className={`heavy-deep-node heavy-level-${level}`}>
      <Text className="heavy-deep-title">H{level} {label}</Text>
      {renderHeavyDeepTree(level + 1, maxLevel)}
    </View>
  )
}

export default function HeavyContent() {
  return (
    <View className="heavy-panel">
      <Image className="heavy-logo" src={logo} mode="widthFix" />
      <Text className="heavy-title">HeavyContent 组件</Text>
      <Text className="heavy-meta">
        私有 helper 计算结果 {sum(2, 3)}，标签 {label()}
      </Text>
      <View className="heavy-deep">
        <Text className="heavy-deep-heading">深层样式展示（重组件 6 层嵌套）</Text>
        <Text className="heavy-deep-note">
          用 6 层嵌套节点验证深层后代选择器与 level-N 层级样式在异步 chunk 内稳定命中。
        </Text>
        {renderHeavyDeepTree(0, 6)}
      </View>
    </View>
  )
}
