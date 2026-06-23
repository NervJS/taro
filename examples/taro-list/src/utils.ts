export interface IProducts {
  name: string
  image: string
  comment: string
  sales: number
  rate: number
  price: number
}

export interface IProductsData {
  category: string,
  products: IProducts[]
}

export function getCategory (): string[] {
	let categorys = [
	  '中小商户',
	  '商超零售',
	  '品牌服饰',
	  '餐饮',
	  '医疗',
	  '酒旅',
	  '政务',
	  '开发技术',
	  '产品能力',
	  '运营规范',
	]
	return categorys
}

export function getProducts (): IProducts[] {
	const products = [
		'小程序性能优化课程',
		'小程序直播企业实践案例',
		'微信客服轻松配置，入门必修',
		'小程序如何帮助传统医院数字化？',
		'帮你快速掌握小商店经营秘诀',
		'了解小程序开发动态，听官方为你解读新能力',
		'快速了解微信小程序在医疗行业的应用',
		'解析常见小程序违规类型',
		'想做互联网的生意，可以通过微信怎么经营呢？',
		'政务行业小程序实践'
	]
	const images = [
		'https://res.wx.qq.com/op_res/RBwYn_b7VGuWuLJ2qBChU_LhYxhaP5JTy7TWgezsDY7RW_l_e04fR7oG7sCKmS8hc8mVeZaY6eUWT3nk-ww_ZQ',
		'https://res.wx.qq.com/op_res/RBwYn_b7VGuWuLJ2qBChU-O3axOjUJGFgutF9Xc1JL1uxXFWYdW85mWG0Zvm5nv7rvP18CJ0q6-RRFM0xWLLog',
		'https://res.wx.qq.com/op_res/RBwYn_b7VGuWuLJ2qBChU3ywQmrV-rSREDwo0Hp9m7iIZZ7Njvjq_TlOg_0ss0cgQL0pfKOuB2NRpAcwfALxvw',
		'https://res.wx.qq.com/op_res/RBwYn_b7VGuWuLJ2qBChU1GROxmiPIBOCoA5Es44GxjN0KuCQQsoxEH33l05TCgk04n0dssHAIPxIV2ycSlSJA',
		'https://res.wx.qq.com/op_res/RBwYn_b7VGuWuLJ2qBChU68wmBQzYcfQfuIAh1IKWq7OyG0EWxdWGhotYHFh-k-JpmkJ1Otq-mYUT8Dp3iucvg',
		'https://res.wx.qq.com/op_res/UxKgRAAdvQE0sTh7eCEwT1ASo_fbE3TppPoza_9I7U7OreGNv8F8ltq80gqQSzxa-86bt-gWalLtgPDAhflj-w',
		'https://res.wx.qq.com/op_res/UxKgRAAdvQE0sTh7eCEwT-SSHr1ULMcspj1yPw2dBQkxDV-Y_fOHodKNyHbS2JwBEVLnVKF2X_TPOhwZG9m0hQ',
		'https://res.wx.qq.com/op_res/Zmvv0fisUjaMjuqWLhWWkuzGktaXJEQt46EaKsCKeT06Z4tROseXN0joI7h2qwzqyx2FUy57cveZL-8iArI8_Q',
		'https://res.wx.qq.com/op_res/mGK9l-4vYzVgHuIz_uFeJitcJIfp9P4VSWxi3126XeiyZ2BnnH0xg-oIXAUgHBgaHjBMwxzSjSkEkTMRqzlKZw',
		'https://res.wx.qq.com/op_res/mGK9l-4vYzVgHuIz_uFeJnw5zq4f_XW3swKAowexqAbziuojU5W9v4CJixA-NDJShkfS0ne3KWY_6SB56yqb3g',
	]
	const list: IProducts[] = products.map((name, id) => ({
		name,
		image: images[(id % products.length)],
		comment: '一如既往的好',
		sales: 6500,
		rate: 100,
		price: 0.01
	}))
	return list
}

export function fetchProductsData (): IProductsData[] {
  const categorys = getCategory()
  const data: IProductsData[] = categorys.map(category => ({
    category,
    products: getProducts()
  }))
  return data
}
