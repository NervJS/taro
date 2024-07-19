import { render, waitFor } from '@testing-library/react-native'
import React from 'react'
import { RootSiblingParent } from 'react-native-root-siblings'

import { scanCode } from '../src/lib/scanCode'

describe('scanCode', () => {
  it('should render scanCode success', async () => {
    // @ts-ignore
    const { toJSON, getByLabelText } = render(<RootSiblingParent />)
    scanCode()
    await waitFor(() => getByLabelText('Close'))
    expect(toJSON()).toMatchSnapshot()
  })
})
