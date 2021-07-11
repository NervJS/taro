import notification from '@system.notification'

export function showNotification (opts = {}) {
  const { contentTitle, contentText, clickAction } = opts
  if (clickAction) {
    const uri = clickAction.uri
    clickAction.uri = uri.substr(0, uri.lastIndexOf('/'))
  }
  notification.show({
    contentTitle: contentTitle || undefined,
    contentText: contentText || undefined,
    clickAction: contentText || undefined
  })
}

export default {
  showNotification
}
