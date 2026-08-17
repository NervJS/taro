const router = { navigateTo: (_: { url: string }) => {} }

class Foo {
  navigateTo(_: { url: string }) {}
  run() {
    this.navigateTo({ url: '/pages/x/index' })
    router.navigateTo({ url: '/pages/y/index' })
  }
}

export default function FalsePositivePage() {
  new Foo().run()
  return <view>fp</view>
}
