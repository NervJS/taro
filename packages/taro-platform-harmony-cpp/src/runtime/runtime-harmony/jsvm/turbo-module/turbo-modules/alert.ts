import window from '@ohos.window'

import { TurboModule } from '../TurboModule'

interface IAlertOptions {
  title: string
  message?: string
  primaryButton?: string
  secondaryButton?: string
  cancelable: boolean
}

export class AlertManagerTurboModule extends TurboModule {
  public static readonly NAME = 'AlertManager'

  private constants = {
    buttonClicked: 'buttonClicked',
    dismissed: 'dismissed',
    primaryButton: 1,
    secondaryButton: 2,
  }

  private parseButton(button?: string, buttonKey?: number, onAction?: (action: string, buttonKey?: number) => void) {
    if (button) {
      return ({
        value: button,
        action: () => {
          onAction?.(this.constants.buttonClicked, buttonKey)
          onAction = undefined
        }
      })
    }
    return undefined
  }

  getConstants() {
    return this.constants
  }

  alert(options: IAlertOptions, onError: (error: string) => void, onAction: (action: string, buttonKey?: number) => void) {
    window.getLastWindow(this.ctx.uiAbilityContext).then((value) => {
      // eslint-disable-next-line no-lone-blocks
      {
        const uiContext = value.getUIContext()

        const primaryButton = this.parseButton(options.primaryButton, this.constants.primaryButton, onAction)
        const secondaryButton = this.parseButton(options.secondaryButton, this.constants.secondaryButton, onAction)

        const alertParams = {
          title: options.title,
          message: options.message,
          autoCancel: options.cancelable,
          primaryButton: primaryButton,
          secondaryButton: secondaryButton,
          cancel: () => {
            onAction(this.constants.dismissed)
          },
        }
        uiContext.showAlertDialog(alertParams)
      }
    }).catch(() => onError("Alert dialog couldn't be displayed."))
  }
}
