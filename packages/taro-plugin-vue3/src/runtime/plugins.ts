export const setGlobalDataPlugin = {
  install: (app, data) => {
    app.taroGlobalData = data
  }
}
