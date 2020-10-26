const cameraRoll = {
  saveToCameraRoll (filePath, type) {
    const path = type === 'photo' ? `photo://${filePath}` : `video://${filePath}`
    return new Promise((resolve) => {
      resolve(path)
    })
  }
}

export default cameraRoll
