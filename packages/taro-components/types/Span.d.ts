import { ComponentType } from 'react'

import { StandardProps } from './common'

interface SpanProps extends StandardProps { }

/**
 * 用于支持内联文本和 image / navigator 的混排
 * @classification skyline
 * @supported weapp
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/span.html
 */
declare const Span: ComponentType<SpanProps>
export { Span, SpanProps }
