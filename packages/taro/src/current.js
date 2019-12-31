let Current

if (process.env.TARO_ENV === 'alipay') {
  if (!my.Current) {
    my.Current = {
      current: null,
      index: 0
    }
  }
  Current = my.Current
} else {
  Current = {
    current: null,
    index: 0
  }
}

export {
  Current
}
