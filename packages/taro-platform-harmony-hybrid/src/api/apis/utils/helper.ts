export function createDownload (url = '', download = '') {
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.download = download

  // Note: 需要注意，该方案不能监听用户取消或禁止下载等操作，亦不能获取下载成功或失败状态
  link.click()
}
