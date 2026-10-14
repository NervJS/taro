import { View, Text, Button } from '@tarojs/components'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import './index.scss'

// 模拟 checkout 的 dom.getRoot() 业务代码（硬编码 #app）
function getRoot() {
  // Taro 小程序下 document 是 @tarojs/runtime 注入的（TaroDocument）
  var doc = typeof document !== 'undefined' ? document : null
  if (!doc) return undefined
  var app = doc.getElementById && doc.getElementById('app')
  if (!app) return undefined
  var elements = Array.from(app.children || []).filter(function (item) { return item.nodeName === 'root' })
  return elements[elements.length - 1]
}

// 模拟 checkout 的 modal 挂载逻辑
function ModalContent() {
  return (
    <View style={{ position: 'fixed', top: 100, left: 50, background: '#fff', padding: 20, border: '1px solid #ccc', zIndex: 999 }}>
      <Text>弹窗内容：共享运行时 #app root 挂载成功</Text>
    </View>
  )
}

export default function Index() {
  const [count, setCount] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [rootResult, setRootResult] = useState('')

  const handleOpenModal = function () {
    const root = getRoot()
    setRootResult(root ? ('root found: nodeName=' + root.nodeName + ', children=' + (root.children ? root.children.length : 0)) : 'root NOT FOUND (undefined)')
    if (root) setShowModal(true)
  }

  return (
    <View className="index">
      <View className="header">
        <Text className="title">共享运行时（split 模式）示例</Text>
      </View>

      <View className="desc">
        <Text>
          本页面的业务代码不再打包 Taro / React 运行时。运行时被 external 到独立的
          shared-async-v1 异步核分包统一提供，业务包内只保留一个同步核
          taro-shared-sync.js。下面的计数器验证 React hooks 正常工作。
        </Text>
      </View>

      <View className="counter">
        <Text className="count">count: {count}</Text>
        <Button onClick={() => setCount(count + 1)}>+1</Button>
      </View>

      {/* 新增：模拟 checkout 的 modal 弹窗测试（硬编码 #app getRoot） */}
      <View style={{ marginTop: 20, padding: 10, background: '#f0f0f0' }}>
        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>modal/root 测试（模拟 checkout dom.getRoot）:</Text>
        <Text style={{ fontSize: 12, display: 'block', marginTop: 5 }}>{rootResult || '点下方按钮测试'}</Text>
        <Button onClick={handleOpenModal} style={{ marginTop: 10 }}>唤起弹窗</Button>
        {showModal && createPortal(<ModalContent />, getRoot())}
      </View>
    </View>
  )
}
