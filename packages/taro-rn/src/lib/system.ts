/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

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