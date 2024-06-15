import { render } from '@testing-library/react-native'
import * as React from 'react'

import ScrollView from '../components/ScrollView'

describe('ScrollView', () => {
  it('ScrollView render', () => {
    const wrapper = render(<ScrollView>scroll me</ScrollView>).toJSON()
    expect(wrapper).toMatchSnapshot()
  })
})
