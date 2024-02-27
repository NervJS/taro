import type { TaroProgressElement } from '../runtime'
@Component
export default struct TaroProgress {
  node: TaroProgressElement | null = null

  build() {
    if(this.node) {
      Flex() {
        Progress({
          value: parseFloat(this.node.getAttribute('percent')),

        })
          .color(this.node.getAttribute('activeColor') ?? '#09BB07')
          .backgroundColor(this.node.getAttribute('backgroundColor') ?? '#EBEBEB')
          .style({
            strokeWidth: this.node.getAttribute('strokeWidth'),
            strokeRadius: parseFloat( this.node.getAttribute('borderRadius') ),
            enableSmoothEffect: this.node.getAttribute('active') === 'true'
          })
        if(this.node.getAttribute('showInfo')) {
          Text("20%").fontSize(16)
        }

      }


    }

  }
}