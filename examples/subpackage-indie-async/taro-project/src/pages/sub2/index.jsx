import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useCallback, useState } from 'react'
import './index.scss'

const DEEP_LABELS = ['页面容器', '分包页面栈', '详情卡片', '状态反馈区', '业务行容器', '样式命中层']

function renderDeepTree (level, maxLevel) {
  const label = DEEP_LABELS[level] || '深层业务容器'
  if (level >= maxLevel) {
    return (
      <View className="deep-node deep-leaf">
        <Text className="deep-title text-primary">L{level} 样式命中叶子节点</Text>
        <Text className="deep-copy text-secondary">
          深层嵌套到第 {level} 层，业务样式仍应稳定命中。
        </Text>
      </View>
    )
  }
  return (
    <View className={`deep-node level-${level}`}>
      <Text className="deep-title">L{level} {label}</Text>
      {renderDeepTree(level + 1, maxLevel)}
    </View>
  )
}

export default function Sub2Page() {
  const [status, setStatus] = useState('')
  const [OnlySub2Comp, setOnlySub2Comp] = useState(null)
  const [SharedComp, setSharedComp] = useState(null)

  // 仅 sub2 消费：chunk 归属 pages/sub2-async
  const loadOnlySub2 = useCallback(async () => {
    Taro.showLoading({ title: '动态加载中' })
    try {
      const module = await import('./OnlySub2')
      setOnlySub2Comp(() => module.default)
      setStatus('OnlySub2 加载完成（pages/sub2-async）')
    } catch (err) {
      setStatus(`OnlySub2 加载失败：${err.message}`)
    } finally {
      Taro.hideLoading()
    }
  }, [])

  // 与 sub1 共同消费：chunk 归属 pages/shared-async
  const loadShared = useCallback(async () => {
    Taro.showLoading({ title: '动态加载中' })
    try {
      const module = await import('../../components/SharedBySub1Sub2')
      setSharedComp(() => module.default)
      setStatus('SharedBySub1Sub2 加载完成（pages/shared-async）')
    } catch (err) {
      setStatus(`SharedBySub1Sub2 加载失败：${err.message}`)
    } finally {
      Taro.hideLoading()
    }
  }, [])

  return (
    <View className="sub2-page">
      <View className="header">
        <Text className="title">Sub2 页面（async-only）</Text>
      </View>
      <View className="actions">
        <Button className="button" onClick={loadOnlySub2}>
          动态导入 OnlySub2
        </Button>
        <Button className="button" onClick={loadShared}>
          动态导入 SharedBySub1Sub2
        </Button>
      </View>
      {!!status && (
        <Text className="status">{status}</Text>
      )}

      <View className="deep-case">
        <Text className="deep-case-title">深层样式展示（6 层嵌套）</Text>
        <Text className="deep-case-note">
          用 6 层嵌套节点验证深层后代选择器与 level-N 层级样式在分包页面内稳定命中。
        </Text>
        {renderDeepTree(0, 6)}
      </View>

      {OnlySub2Comp && <OnlySub2Comp />}
      {SharedComp && <SharedComp />}
    </View>
  )
}
