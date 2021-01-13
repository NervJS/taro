import { Dimensions, Platform } from 'react-native'

export const isIPhoneX = (function () {
	const X_WIDTH = 375
	const X_HEIGHT = 812
	const XS_MAX_WIDTH = 414
	const XS_MAX_HEIGHT = 896

	const getResolvedDimensions = () => {
		const { width, height } = Dimensions.get('window')
		if (width === 0 && height === 0) return Dimensions.get('window')
		return { width, height }
	}

	const { height: D_HEIGHT, width: D_WIDTH } = getResolvedDimensions()

	if (Platform.OS === 'web') return false

	return (
		(D_HEIGHT === X_HEIGHT && D_WIDTH === X_WIDTH) ||
		(D_HEIGHT === X_WIDTH && D_WIDTH === X_HEIGHT) ||
		((D_HEIGHT === XS_MAX_HEIGHT && D_WIDTH === XS_MAX_WIDTH) ||
		(D_HEIGHT === XS_MAX_WIDTH && D_WIDTH === XS_MAX_HEIGHT))
	)
})()