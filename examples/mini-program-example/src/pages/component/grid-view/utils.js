function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}

export const generateGridList = (childCount, columns) => {
  const ans = []
  for (let i = 0; i < childCount; i++) {
    ans.push({
      id: i,
      sub: getRandomInt(columns) + 1,
    })
  }
  return ans
}
